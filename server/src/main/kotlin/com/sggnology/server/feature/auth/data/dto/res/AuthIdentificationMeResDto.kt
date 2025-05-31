package com.sggnology.server.feature.auth.data.dto.res

data class AuthIdentificationMeResDto(
    val token: String,
    val userId: String,
    val name: String,
    val nickname: String?,
    val roles: List<String>
)
