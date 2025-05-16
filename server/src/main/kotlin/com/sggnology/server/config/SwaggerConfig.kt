package com.sggnology.server.config

import io.swagger.v3.oas.annotations.OpenAPIDefinition
import io.swagger.v3.oas.annotations.info.Info
import org.springframework.context.annotation.Configuration

@Configuration
@OpenAPIDefinition(
    info = Info(
        title = "Sqaud Only API",
        version = "1.0",
        description = "API documentation for my squad only appliciation"
    )
)
class SwaggerConfig