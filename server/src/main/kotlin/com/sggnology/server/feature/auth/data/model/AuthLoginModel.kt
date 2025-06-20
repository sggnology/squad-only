package com.sggnology.server.feature.auth.data.model

import com.sggnology.server.feature.auth.data.dto.req.AuthLoginReqDto

data class AuthLoginModel(
    val userId: String,
    val password: String,
    val encrypted: Boolean? = false
) {
    companion object{
        fun fromAuthLoginReqDto(dto: AuthLoginReqDto): AuthLoginModel {
            return AuthLoginModel(
                userId = dto.userId,
                password = dto.password,
                encrypted = dto.encrypted
            )
        }
    }
}