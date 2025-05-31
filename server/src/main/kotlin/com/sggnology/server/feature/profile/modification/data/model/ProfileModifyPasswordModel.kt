package com.sggnology.server.feature.profile.modification.data.model

import com.sggnology.server.feature.profile.modification.data.dto.req.ProfilePasswordModificationReqDto

data class ProfileModifyPasswordModel(
    val currentPassword: String,
    val newPassword: String,
    val confirmNewPassword: String
) {
    companion object {
        fun fromProfilePasswordModificationReqDto(
            req: ProfilePasswordModificationReqDto
        ): ProfileModifyPasswordModel {
            return ProfileModifyPasswordModel(
                currentPassword = req.currentPassword,
                newPassword = req.newPassword,
                confirmNewPassword = req.confirmNewPassword
            )
        }
    }
}
