package com.sggnology.server.endpoint.auth

import com.sggnology.server.feature.auth.data.model.AuthIdentifyMeModel
import com.sggnology.server.feature.auth.data.dto.req.AuthLoginReqDto
import com.sggnology.server.feature.auth.data.dto.res.AuthIdentificationMeResDto
import com.sggnology.server.feature.auth.data.dto.res.AuthLoginResDto
import com.sggnology.server.feature.auth.data.dto.res.AuthPublicKeyInquiryResDto
import com.sggnology.server.feature.auth.data.model.AuthLoginModel
import com.sggnology.server.feature.auth.service.AuthService
import com.sggnology.server.feature.auth.service.AuthCryptoService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("api/v1/auth")
@Tag(name = "인증 API")
class AuthController(
    private val authService: AuthService,
    private val authCryptoService: AuthCryptoService,
) {

    @GetMapping("/public-key")
    fun getPublicKey(): AuthPublicKeyInquiryResDto {
        return AuthPublicKeyInquiryResDto(
            publicKey = authCryptoService.getPublicKey()
        )
    }

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
        val loginResponse = authService.execute(
            AuthLoginModel.fromAuthLoginReqDto(authLoginReqDto)
        )
        return loginResponse
    }

    @Operation(
        summary = "토큰을 기반으로 인증 정보 확인"
    )
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "인증 성공", useReturnTypeSchema = true),
    ])
    @GetMapping("/me")
    fun identifyMe(
        @RequestHeader("Authorization") authorizationHeader: String,
    ): AuthIdentificationMeResDto {
        val loginResponse = authService.execute(
            AuthIdentifyMeModel.fromAuthorizationHeader(authorizationHeader)
        )
        return loginResponse
    }
}

