package com.sggnology.server.feature.profile.modification.service

import com.sggnology.server.common.annotation.WithUserInfo
import com.sggnology.server.common.util.UserInfoContextHolder
import com.sggnology.server.db.sql.repository.UserInfoRepository
import com.sggnology.server.feature.profile.modification.data.model.ProfileModifyPasswordModel
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ProfilePasswordModificationService(
    private val userInfoRepository: UserInfoRepository,
    private val passwordEncoder: PasswordEncoder
) {

    @WithUserInfo
    @Transactional
    fun execute(
        profileModifyPasswordModel: ProfileModifyPasswordModel
    ) {
        val userInfo = UserInfoContextHolder.getUserInfo()

        if (
            !passwordEncoder.matches(
                profileModifyPasswordModel.currentPassword,
                userInfo.userPw
            )
        ) {
            throw IllegalArgumentException("Current password is incorrect.")
        }

        userInfo.userPw = passwordEncoder.encode(profileModifyPasswordModel.newPassword)

        userInfoRepository.save(userInfo)
    }
}