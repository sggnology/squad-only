package com.sggnology.server.service.auth

import com.sggnology.server.db.sql.entity.RoleInfo
import com.sggnology.server.db.sql.entity.UserInfo
import com.sggnology.server.db.sql.entity.UserRoleInfo
import com.sggnology.server.db.sql.repository.UserInfoRepository
import com.sggnology.server.feature.auth.data.dto.req.AuthLoginReqDto
import com.sggnology.server.feature.auth.data.model.AuthLoginModel
import com.sggnology.server.feature.auth.service.AuthService
import com.sggnology.server.security.JwtTokenProvider
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentMatchers.anyList
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.eq
import org.mockito.kotlin.verify
import org.mockito.kotlin.verifyNoInteractions
import org.springframework.context.ApplicationEventPublisher
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.crypto.password.PasswordEncoder

@ExtendWith(MockitoExtension::class)
class AuthServiceTest {

    @Mock
    private lateinit var userInfoRepository: UserInfoRepository

    @Mock
    private lateinit var passwordEncoder: PasswordEncoder

    @Mock
    private lateinit var jwtTokenProvider: JwtTokenProvider

    @Mock
    private lateinit var eventPublisher: ApplicationEventPublisher

    @InjectMocks
    private lateinit var authService: AuthService

    private lateinit var testUser: UserInfo

    @BeforeEach
    fun setup() {
        // 테스트 사용자 생성
        testUser = UserInfo(
            idx = 1L,
            userId = "testUser",
            userPw = "encodedPassword",
            name = "Test User",
            nickname = "tester"
        )

        // 사용자 권한 추가
        val roleInfo = RoleInfo(role = "USER")

        // 권한 연결
        val userRoleInfo =  UserRoleInfo(
            userInfo = testUser,
            roleInfo = roleInfo
        )

        testUser.userRoleInfos.add(userRoleInfo)
        roleInfo.userRoleInfos.add(userRoleInfo)
    }

    @Test
    fun `login should return LoginResponse with token when credentials are valid`() {
        // given
        val loginRequestDto = AuthLoginReqDto("testUser", "password")

        `when`(userInfoRepository.findByUserId("testUser")).thenReturn(testUser)
        `when`(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true)
        `when`(jwtTokenProvider.createToken(eq("testUser"), anyList())).thenReturn("test-jwt-token")

        // when
        val loginResponse = authService.execute(AuthLoginModel.fromAuthLoginReqDto(loginRequestDto))

        // then
        assertEquals("test-jwt-token", loginResponse.token)
        assertEquals("testUser", loginResponse.userId)
        assertEquals("Test User", loginResponse.name)
        assertEquals("tester", loginResponse.nickname)
        assertTrue(loginResponse.roles.contains("USER"))

        verify(userInfoRepository).findByUserId("testUser")
        verify(passwordEncoder).matches("password", "encodedPassword")
        verify(jwtTokenProvider).createToken(eq("testUser"), anyList())
    }

    @Test
    fun `login should throw exception when user not found`() {
        // given
        val loginRequest = AuthLoginReqDto("nonExistentUser", "password")

        `when`(userInfoRepository.findByUserId("nonExistentUser")).thenReturn(null)

        // when & then
        assertThrows(BadCredentialsException::class.java) {
            authService.execute(AuthLoginModel.fromAuthLoginReqDto(loginRequest))
        }

        verify(userInfoRepository).findByUserId("nonExistentUser")
        verifyNoInteractions(passwordEncoder)
        verifyNoInteractions(jwtTokenProvider)
    }

    @Test
    fun `login should throw exception when password is invalid`() {
        // given
        val loginRequest = AuthLoginReqDto("testUser", "wrongPassword")

        `when`(userInfoRepository.findByUserId("testUser")).thenReturn(testUser)
        `when`(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false)

        // when & then
        assertThrows(BadCredentialsException::class.java) {
            authService.execute(AuthLoginModel.fromAuthLoginReqDto(loginRequest))
        }

        verify(userInfoRepository).findByUserId("testUser")
        verify(passwordEncoder).matches("wrongPassword", "encodedPassword")
        verifyNoInteractions(jwtTokenProvider)
    }
}
