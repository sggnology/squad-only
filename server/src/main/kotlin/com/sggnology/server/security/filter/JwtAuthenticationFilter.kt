package com.sggnology.server.security.filter

import com.sggnology.server.db.sql.repository.UserInfoRepository
import com.sggnology.server.security.JwtTokenProvider
import com.sggnology.server.util.JwtTokenUtil
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.filter.OncePerRequestFilter

class JwtAuthenticationFilter(
    private val jwtTokenProvider: JwtTokenProvider,
    private val userInfoRepository: UserInfoRepository
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val token = JwtTokenUtil.resolveToken(request)

        if (token != null && jwtTokenProvider.validateToken(token)) {
            val authentication = jwtTokenProvider.getAuthentication(token)
            SecurityContextHolder.getContext().authentication = authentication

            val userId = authentication.name
            val userInfo = userInfoRepository.findByUserId(userId)

            if (userInfo == null || !userInfo.isAccessEnabled()) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "User account is not accessible")
                return
            }
        }

        filterChain.doFilter(request, response)
    }
}