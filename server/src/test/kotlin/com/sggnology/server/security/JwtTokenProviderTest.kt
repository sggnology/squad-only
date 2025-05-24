package com.sggnology.server.security

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.security.core.authority.SimpleGrantedAuthority

class JwtTokenProviderTest {

    private lateinit var jwtTokenProvider: JwtTokenProvider
    private lateinit var jwtProperties: JwtProperties

    @BeforeEach
    fun setup() {
        jwtProperties = JwtProperties()
        jwtProperties.secret = "testSecretKeyForJwtTestsNeedsToBeLongEnoughForHS512AAAAAAAAAAAAAA"
        jwtProperties.expirationMs = 3600000 // 1 hour

        jwtTokenProvider = JwtTokenProvider(jwtProperties)
    }

    @Test
    fun `should create token and extract authentication`() {
        // given
        val username = "testUser"
        val authorities = listOf(SimpleGrantedAuthority("ROLE_USER"))

        // when
        val token = jwtTokenProvider.createToken(username, authorities)

        // then
        assertNotNull(token)
        assertTrue(token.isNotEmpty())

        // when
        val authentication = jwtTokenProvider.getAuthentication(token)

        // then
        assertEquals(username, authentication.name)
        assertTrue(authentication.authorities.contains(SimpleGrantedAuthority("ROLE_USER")))
    }

    @Test
    fun `should validate valid token`() {
        // given
        val username = "testUser"
        val authorities = listOf(SimpleGrantedAuthority("ROLE_USER"))
        val token = jwtTokenProvider.createToken(username, authorities)

        // when
        val isValid = jwtTokenProvider.validateToken(token)

        // then
        assertTrue(isValid)
    }

    @Test
    fun `should not validate expired token`() {
        // given - token with very short expiration
        jwtProperties.expirationMs = 1 // 1 millisecond
        val username = "testUser"
        val authorities = listOf(SimpleGrantedAuthority("ROLE_USER"))
        val token = jwtTokenProvider.createToken(username, authorities)

        // wait for token to expire
        Thread.sleep(10)

        // when
        val isValid = jwtTokenProvider.validateToken(token)

        // then
        assertFalse(isValid)
    }

    @Test
    fun `should not validate tampered token`() {
        // given
        val username = "testUser"
        val authorities = listOf(SimpleGrantedAuthority("ROLE_USER"))
        val token = jwtTokenProvider.createToken(username, authorities)

        // when - tamper the token
        val tamperedToken = token.substring(0, token.length - 5) + "12345"

        // then
        assertEquals(false, jwtTokenProvider.validateToken(tamperedToken))
    }
}
