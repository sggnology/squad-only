package com.sggnology.server.config

import com.sggnology.server.common.type.RoleType
import com.sggnology.server.common.constants.SiteConfig
import com.sggnology.server.db.sql.entity.ConfigInfo
import com.sggnology.server.db.sql.entity.UserInfo
import com.sggnology.server.db.sql.repository.ConfigInfoRepository
import com.sggnology.server.db.sql.repository.RoleInfoRepository
import com.sggnology.server.db.sql.repository.UserInfoRepository
import com.sggnology.server.util.logger
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.password.PasswordEncoder

@Configuration
class InitialDataConfig(
    private val userInfoRepository: UserInfoRepository,
    private val passwordEncoder: PasswordEncoder,
    private val adminProperties: AdminProperties,
    private val roleInfoRepository: RoleInfoRepository,
    private val configInfoRepository: ConfigInfoRepository
) {

    @Bean
    fun initialAdminAccountSetup(): CommandLineRunner {
        return CommandLineRunner {
            // 초기 관리자 계정 생성이 필요한지 확인
            if (
                adminProperties.password.isNotEmpty()
                && !userInfoRepository.existsByUserId(adminProperties.username)
            ) {
                logger.info("초기 관리자 계정을 생성합니다: ${adminProperties.username}")

                try {
                    val encodedPassword = passwordEncoder.encode(adminProperties.password)

                    val adminUser = UserInfo(
                        userId = adminProperties.username,
                        userPw = encodedPassword,
                        name = adminProperties.name,
                        nickname = null
                    )

                    // 관리자 역할 할당
                    adminUser.addRole(RoleType.ADMIN.toRoleInfo(roleInfoRepository)) // 관리자 역할

                    userInfoRepository.save(adminUser)

                    logger.info("초기 관리자 계정 생성 완료: ${adminProperties.username}")
                } catch (e: Exception) {
                    logger.error("초기 관리자 계정 생성 실패", e)
                }
            }
        }
    }

    @Bean
    fun initialConfigSetup(): CommandLineRunner {
        return CommandLineRunner {
            // 초기 설정 정보가 없는 경우 기본 설정 정보 생성

            val siteNameConfigInfo = configInfoRepository.findByKey(SiteConfig.SITE_NAME_KEY)

            if (siteNameConfigInfo == null) {
                logger.info("초기 설정 정보를 생성합니다: ${SiteConfig.SITE_NAME_KEY}")

                try {
                    configInfoRepository.save(
                        ConfigInfo(
                            key = SiteConfig.SITE_NAME_KEY,
                            value = SiteConfig.SITE_NAME_VALUE_DEFAULT
                        )
                    )
                } catch (e: Exception) {
                    logger.error("초기 설정 정보 생성 실패", e)
                }
            } else {
                logger.info("초기 설정 정보가 이미 존재합니다. 추가 작업이 필요하지 않습니다.")
            }

        }
    }
}
