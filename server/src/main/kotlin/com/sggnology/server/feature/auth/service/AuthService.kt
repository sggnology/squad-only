package com.sggnology.server.feature.auth.service

import com.sggnology.server.db.sql.repository.UserInfoRepository
import com.sggnology.server.feature.auth.data.dto.req.AuthLoginReqDto
import com.sggnology.server.feature.auth.data.dto.res.AuthLoginResDto
import com.sggnology.server.security.JwtTokenProvider
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthService(
    private val userInfoRepository: UserInfoRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtTokenProvider: JwtTokenProvider
) {

    @Transactional(readOnly = true)
    fun execute(
        authLoginReqDto: AuthLoginReqDto
    ): AuthLoginResDto {
        val userInfo = userInfoRepository.findByUserId(authLoginReqDto.userId)
            ?: throw BadCredentialsException("Invalid credentials")

        if (!passwordEncoder.matches(authLoginReqDto.password, userInfo.userPw)) {
            throw BadCredentialsException("Invalid credentials")
        }

        val authorities = userInfo.getRoleList().map { SimpleGrantedAuthority(it) }

        val token = jwtTokenProvider.createToken(userInfo.userId, authorities)

        return AuthLoginResDto(
            token = token,
            userId = userInfo.userId,
            name = userInfo.name,
            nickname = userInfo.nickname,
            roles = userInfo.getRoleList()
        )
    }
}