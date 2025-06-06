package com.sggnology.server.feature.auth.service

import com.sggnology.server.common.util.ClientIPHolder
import com.sggnology.server.db.sql.entity.UserInfo
import com.sggnology.server.db.sql.repository.UserInfoRepository
import com.sggnology.server.feature.activity_log.handler.event.LoginLogEvent
import com.sggnology.server.feature.auth.data.dto.res.AuthIdentificationMeResDto
import com.sggnology.server.feature.auth.data.model.AuthIdentifyMeModel
import com.sggnology.server.feature.auth.data.dto.res.AuthLoginResDto
import com.sggnology.server.feature.auth.data.model.AuthLoginModel
import com.sggnology.server.security.JwtTokenProvider
import com.sggnology.server.common.util.JwtTokenUtil
import org.springframework.context.ApplicationEventPublisher
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class AuthService(
    private val userInfoRepository: UserInfoRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtTokenProvider: JwtTokenProvider,
    private val eventPublisher: ApplicationEventPublisher
) {

    @Transactional
    fun execute(
        authLoginModel: AuthLoginModel
    ): AuthLoginResDto {
        val userInfo = userInfoRepository.findByUserId(authLoginModel.userId)
            ?: throw BadCredentialsException("Invalid credentials")

        validateUserState(userInfo)

        validateUserCredentials(authLoginModel.password, userInfo)

        val authorities = userInfo.getRoleList().map { SimpleGrantedAuthority(it) }

        val token = jwtTokenProvider.createToken(userInfo.userId, authorities)
        userInfoRepository.save(
            userInfo.apply {
                lastLoginAt = LocalDateTime.now()
            }
        )

        // 로그인 이벤트 퍼블리싱
        eventPublisher.publishEvent(
            LoginLogEvent(
                userId = userInfo.userId,
                username = userInfo.nickname ?: userInfo.name,
                ip = ClientIPHolder.get()
            )
        )

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
    ): AuthIdentificationMeResDto {

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

        validateUserState(userInfo)

        return AuthIdentificationMeResDto(
            token = token,
            userId = userInfo.userId,
            name = userInfo.name,
            nickname = userInfo.nickname,
            roles = userInfo.getRoleList()
        )
    }

    private fun validateUserState(
        userInfo: UserInfo
    ) {

        if (!userInfo.isAccessEnabled()) {
            throw BadCredentialsException("User account is not accessible")
        }

    }

    private fun validateUserCredentials(
        password: String,
        userInfo: UserInfo
    ) {
        if (!passwordEncoder.matches(password, userInfo.userPw)) {
            throw BadCredentialsException("Invalid credentials")
        }
    }
}