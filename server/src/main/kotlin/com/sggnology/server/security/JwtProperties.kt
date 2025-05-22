package com.sggnology.server.security

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "jwt")
class JwtProperties {
    var secret: String = "your-secret-key-should-be-at-least-64-bytes-for-security-best-practices"
    var expirationMs: Long = 86400000 // 24시간
    var refreshExpirationMs: Long = 604800000 // 7일
}