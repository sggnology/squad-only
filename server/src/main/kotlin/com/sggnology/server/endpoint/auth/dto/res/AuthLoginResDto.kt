package com.sggnology.server.endpoint.auth.dto.res

data class AuthLoginResDto(
    val token: String,
    val userId: String,
    val name: String,
    val nickname: String?,
    val roles: List<String>
)
