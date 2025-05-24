package com.sggnology.server.endpoint.auth

import com.sggnology.server.feature.auth.data.dto.req.AuthLoginReqDto
import com.sggnology.server.feature.auth.data.dto.res.AuthLoginResDto
import com.sggnology.server.feature.auth.service.AuthService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("api/v1/auth")
@Tag(name = "인증 API")
class AuthController(
    private val authService: AuthService
) {

    @Operation(
        summary = "로그인"
    )
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "로그인 성공", useReturnTypeSchema = true),
    ])
    @PostMapping("")
    fun login(
        @RequestBody authLoginReqDto: AuthLoginReqDto
    ): AuthLoginResDto {
        val loginResponse = authService.execute(authLoginReqDto)
        return loginResponse
    }
}

