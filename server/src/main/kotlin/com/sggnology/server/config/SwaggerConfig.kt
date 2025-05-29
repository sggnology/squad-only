package com.sggnology.server.config

import io.swagger.v3.oas.annotations.OpenAPIDefinition
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType
import io.swagger.v3.oas.annotations.info.Info
import io.swagger.v3.oas.annotations.security.SecurityRequirement
import io.swagger.v3.oas.annotations.security.SecurityScheme
import org.springframework.context.annotation.Configuration

@Configuration
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    `in` = SecuritySchemeIn.HEADER,
    description = "JWT 토큰을 입력해주세요. Bearer 접두사는 자동으로 추가됩니다."
)
@OpenAPIDefinition(
    info = Info(
        title = "Sqaud Only API",
        version = "1.0",
        description = "API documentation for my squad only appliciation"
    ),
    security = [SecurityRequirement(name = "bearerAuth")]
)
class SwaggerConfig

