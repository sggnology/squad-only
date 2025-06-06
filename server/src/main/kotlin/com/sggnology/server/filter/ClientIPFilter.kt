package com.sggnology.server.filter

import com.sggnology.server.common.util.ClientIPHolder
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class ClientIPFilter : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        try {
            val ip = extractClientIP(request)
            ClientIPHolder.set(ip)
            filterChain.doFilter(request, response)
        } finally {
            ClientIPHolder.clear() // 메모리 누수 방지
        }
    }

    private fun extractClientIP(request: HttpServletRequest): String? {
        val xfHeader = request.getHeader("X-Forwarded-For")
        if (xfHeader != null) {
            return xfHeader.split(",".toRegex()).dropLastWhile { it.isEmpty() }.toTypedArray()[0]
        }
        return request.remoteAddr
    }
}