package com.sggnology.server.security

import com.sggnology.server.db.sql.entity.UserInfo
import com.sggnology.server.db.sql.repository.UserInfoRepository
import com.sggnology.server.security.filter.JwtAuthenticationFilter
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.ArgumentMatchers.anyString
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.mockito.kotlin.*
import org.mockito.junit.jupiter.MockitoExtension
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder

@ExtendWith(MockitoExtension::class)
class JwtAuthenticationFilterTest {

    @Mock
    private lateinit var jwtTokenProvider: JwtTokenProvider

    @Mock
    private lateinit var request: HttpServletRequest

    @Mock
    private lateinit var response: HttpServletResponse

    @Mock
    private lateinit var filterChain: FilterChain

    @Mock
    private lateinit var authentication: Authentication

    @Mock
    private lateinit var userInfoRepository: UserInfoRepository

    @Mock
    private lateinit var userInfo: UserInfo

    private lateinit var jwtAuthenticationFilter: JwtAuthenticationFilter

    @BeforeEach
    fun setup() {
        jwtAuthenticationFilter = JwtAuthenticationFilter(jwtTokenProvider, userInfoRepository)
        SecurityContextHolder.clearContext() // 각 테스트 전에 SecurityContext 초기화

        // Mock UserInfo behavior
        `when`(authentication.name).thenReturn("testUser")
        `when`(userInfo.isAccessEnabled()).thenReturn(true)
    }

    @Test
    fun `should set authentication when token is valid`() {
        // given
        val token = "valid-token"
        `when`(request.getHeader("Authorization")).thenReturn("Bearer $token")
        `when`(jwtTokenProvider.validateToken(token)).thenReturn(true)
        `when`(jwtTokenProvider.getAuthentication(token)).thenReturn(authentication)
        `when`(userInfoRepository.findByUserId(eq("testUser"))).thenReturn(userInfo)

        // when
        jwtAuthenticationFilter.doFilter(request, response, filterChain)

        // then
        verify(jwtTokenProvider).validateToken(token)
        verify(jwtTokenProvider).getAuthentication(token)
        verify(filterChain).doFilter(request, response)
        assertEquals(authentication, SecurityContextHolder.getContext().authentication)
    }

    @Test
    fun `should not set authentication when token is invalid`() {
        // given
        val token = "invalid-token"
        `when`(request.getHeader("Authorization")).thenReturn("Bearer $token")
        `when`(jwtTokenProvider.validateToken(token)).thenReturn(false)

        // when
        jwtAuthenticationFilter.doFilter(request, response, filterChain)

        // then
        verify(jwtTokenProvider).validateToken(token)
        verify(jwtTokenProvider, never()).getAuthentication(token)
        verify(filterChain).doFilter(request, response)
        assertNull(SecurityContextHolder.getContext().authentication)
    }

    @Test
    fun `should not set authentication when authorization header is missing`() {
        // given
        `when`(request.getHeader("Authorization")).thenReturn(null)

        // when
        jwtAuthenticationFilter.doFilter(request, response, filterChain)

        // then
        verify(jwtTokenProvider, never()).validateToken(anyString())
        verify(jwtTokenProvider, never()).getAuthentication(anyString())
        verify(filterChain).doFilter(request, response)
        assertNull(SecurityContextHolder.getContext().authentication)
    }

    @Test
    fun `should not set authentication when authorization header does not start with Bearer`() {
        // given
        val token = "some-token"
        `when`(request.getHeader("Authorization")).thenReturn("Token $token")

        // when
        jwtAuthenticationFilter.doFilter(request, response, filterChain)

        // then
        verify(jwtTokenProvider, never()).validateToken(anyString())
        verify(jwtTokenProvider, never()).getAuthentication(anyString())
        verify(filterChain).doFilter(request, response)
        assertNull(SecurityContextHolder.getContext().authentication)
    }
}
