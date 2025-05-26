package com.sggnology.server.feature.auth.service

import com.sggnology.server.db.sql.repository.UserInfoRepository
import com.sggnology.server.feature.auth.data.dto.req.AuthIdentifyMeModel
import com.sggnology.server.feature.auth.data.dto.req.AuthLoginReqDto
import com.sggnology.server.feature.auth.data.dto.res.AuthLoginResDto
import com.sggnology.server.feature.auth.data.model.AuthLoginModel
import com.sggnology.server.security.JwtTokenProvider
import com.sggnology.server.util.JwtTokenUtil
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.Authentication
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
        authLoginModel: AuthLoginModel
    ): AuthLoginResDto {
        val userInfo = userInfoRepository.findByUserId(authLoginModel.userId)
            ?: throw BadCredentialsException("Invalid credentials")

        if (!passwordEncoder.matches(authLoginModel.password, userInfo.userPw)) {
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

    @Transactional(readOnly = true)
    fun execute(
        authIdentifyMeModel: AuthIdentifyMeModel
    ): AuthLoginResDto {

        if(authIdentifyMeModel.accessToken == null) {
            throw BadCredentialsException("Access token is required")
        }

        val token = JwtTokenUtil.resolveToken(authIdentifyMeModel.accessToken)

        if(token == null) {
            throw BadCredentialsException("Invalid access token")
        }

        if (!jwtTokenProvider.validateToken(token)) {
            throw BadCredentialsException("Invalid or expired token")
        }

        val authentication = jwtTokenProvider.getAuthentication(token)

        val userInfo = userInfoRepository.findByUserId(authentication.name)
            ?: throw BadCredentialsException("Invalid credentials")

//        val newToken = jwtTokenProvider.createToken(userInfo.userId, authorities)

        return AuthLoginResDto(
            token = token,
            userId = userInfo.userId,
            name = userInfo.name,
            nickname = userInfo.nickname,
            roles = userInfo.getRoleList()
        )
    }
}