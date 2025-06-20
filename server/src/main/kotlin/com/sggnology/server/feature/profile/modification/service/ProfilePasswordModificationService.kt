package com.sggnology.server.feature.profile.modification.service

import com.sggnology.server.common.annotation.WithUserInfo
import com.sggnology.server.common.util.UserInfoContextHolder
import com.sggnology.server.db.sql.repository.UserInfoRepository
import com.sggnology.server.feature.profile.modification.data.model.ProfileModifyPasswordModel
import com.sggnology.server.feature.auth.service.AuthCryptoService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ProfilePasswordModificationService(
    private val userInfoRepository: UserInfoRepository,
    private val passwordEncoder: PasswordEncoder,
    private val authCryptoService: AuthCryptoService
) {
    @WithUserInfo
    @Transactional
    fun execute(
        profileModifyPasswordModel: ProfileModifyPasswordModel
    ) {
        val userInfo = UserInfoContextHolder.getUserInfo()

        // 암호화된 비밀번호인지 확인하고 복호화
        val actualCurrentPassword = if (profileModifyPasswordModel.encrypted == true) {
            try {
                authCryptoService.decryptPassword(profileModifyPasswordModel.currentPassword)
            } catch (e: Exception) {
                throw IllegalArgumentException("Invalid encrypted current password")
            }
        } else {
            profileModifyPasswordModel.currentPassword
        }

        val actualNewPassword = if (profileModifyPasswordModel.encrypted == true) {
            try {
                authCryptoService.decryptPassword(profileModifyPasswordModel.newPassword)
            } catch (e: Exception) {
                throw IllegalArgumentException("Invalid encrypted new password")
            }
        } else {
            profileModifyPasswordModel.newPassword
        }

        val actualConfirmNewPassword = if (profileModifyPasswordModel.encrypted == true) {
            try {
                authCryptoService.decryptPassword(profileModifyPasswordModel.confirmNewPassword)
            } catch (e: Exception) {
                throw IllegalArgumentException("Invalid encrypted new password")
            }
        } else {
            profileModifyPasswordModel.confirmNewPassword
        }

        if(actualNewPassword != actualConfirmNewPassword){
            throw IllegalArgumentException("Invalid newPassword and confirmNewPassword")
        }

        if (
            !passwordEncoder.matches(
                actualCurrentPassword,
                userInfo.userPw
            )
        ) {
            throw IllegalArgumentException("Current password is incorrect.")
        }

        userInfo.userPw = passwordEncoder.encode(actualNewPassword)

        userInfoRepository.save(userInfo)
    }
}