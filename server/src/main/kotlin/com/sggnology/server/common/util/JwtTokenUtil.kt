package com.sggnology.server.common.util

import jakarta.servlet.http.HttpServletRequest
import org.springframework.util.StringUtils

object JwtTokenUtil {

    fun resolveToken(request: HttpServletRequest): String? {
        val bearerToken = request.getHeader("Authorization")
        return resolveToken(bearerToken)
    }

    fun resolveToken(bearerToken: String?): String? {
        return if (
            bearerToken != null &&
            StringUtils.hasText(bearerToken) &&
            bearerToken.startsWith("Bearer ")
        ) {
            bearerToken.substring(7)
        } else null
    }
}