package com.sggnology.server.security

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component
import java.util.concurrent.TimeUnit

@Component
@ConfigurationProperties(prefix = "jwt")
class JwtProperties {
    var secret: String = "defaultSecretKeyNeedsToBeAtLeast32BytesLongForHS512Algorithm"
    var expirationMs: Long = TimeUnit.HOURS.toMillis(24) // 기본 24시간
}