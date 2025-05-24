package com.sggnology.server.config

import com.sggnology.server.constants.RoleType
import com.sggnology.server.db.sql.entity.UserInfo
import com.sggnology.server.db.sql.repository.RoleInfoRepository
import com.sggnology.server.db.sql.repository.UserInfoRepository
import org.slf4j.LoggerFactory
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.password.PasswordEncoder

@Configuration
class InitialDataConfig(
    private val userInfoRepository: UserInfoRepository,
    private val passwordEncoder: PasswordEncoder,
    private val adminProperties: AdminProperties,
    private val roleInfoRepository: RoleInfoRepository
) {

    private val logger = LoggerFactory.getLogger(InitialDataConfig::class.java)

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
}
