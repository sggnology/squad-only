package com.sggnology.server.endpoint.auth

import com.sggnology.server.feature.auth.data.dto.req.AuthLoginReqDto
import com.sggnology.server.feature.auth.data.dto.res.AuthLoginResDto
import com.sggnology.server.feature.auth.service.AuthService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/auth")
class AuthController(
    private val authService: AuthService
) {

    @PostMapping("")
    fun login(
        @RequestBody authLoginReqDto: AuthLoginReqDto
    ): AuthLoginResDto {
        val loginResponse = authService.execute(authLoginReqDto)
        return loginResponse
    }
}

