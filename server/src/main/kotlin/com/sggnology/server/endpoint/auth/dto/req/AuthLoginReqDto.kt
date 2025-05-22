package com.sggnology.server.endpoint.auth.dto.req

data class AuthLoginReqDto(
    val userId: String,
    val password: String
)
