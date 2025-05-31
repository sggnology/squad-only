package com.sggnology.server.feature.profile.modification.data.dto.req

data class ProfilePasswordModificationReqDto(
    val currentPassword: String,
    val newPassword: String,
    val confirmNewPassword: String
)
