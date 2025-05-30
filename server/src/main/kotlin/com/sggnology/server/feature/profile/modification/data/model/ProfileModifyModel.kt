package com.sggnology.server.feature.profile.modification.data.model

import com.sggnology.server.feature.profile.modification.data.dto.req.ProfileModificationReqDto

data class ProfileModifyModel(
    val name: String,
    val nickname: String
) {
    companion object {
        fun fromProfileModificationReqDto(
            profileModificationReqDto: ProfileModificationReqDto
        ): ProfileModifyModel {
            return ProfileModifyModel(
                name = profileModificationReqDto.name,
                nickname = profileModificationReqDto.nickname
            )
        }
    }
}