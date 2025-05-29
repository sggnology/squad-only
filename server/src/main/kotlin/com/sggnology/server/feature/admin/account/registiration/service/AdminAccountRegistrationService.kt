package com.sggnology.server.feature.admin.account.registiration.service

import com.sggnology.server.common.type.RoleType
import com.sggnology.server.db.sql.entity.UserRoleInfo
import com.sggnology.server.db.sql.repository.RoleInfoRepository
import com.sggnology.server.db.sql.repository.UserInfoRepository
import com.sggnology.server.feature.admin.account.registiration.data.model.AdminRegisterAccountModel
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AdminAccountRegistrationService(
    private val userInfoRepository: UserInfoRepository,
    private val roleInfoRepository: RoleInfoRepository,
    private val passwordEncoder: PasswordEncoder
) {

    @Transactional
    fun execute(adminRegisterAccountModel: AdminRegisterAccountModel) {
        val roleInfo = RoleType.USER.toRoleInfo(roleInfoRepository)

        val newUserInfo = adminRegisterAccountModel.toUserInfo()
            .apply {
                this.userPw = passwordEncoder.encode(this.userPw)
            }
            .also {
                it.userRoleInfos.add(
                    UserRoleInfo(
                        userInfo = it,
                        roleInfo = roleInfo
                    )
                )
            }

        userInfoRepository.save(newUserInfo)
    }
}