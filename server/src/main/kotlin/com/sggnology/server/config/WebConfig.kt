package com.sggnology.server.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer


@Configuration
class WebConfig : WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        // 현재는 서버가 react 를 포워딩해주고 있기에 cors 가 발생하지 않는다.
//        registry.addMapping("/api/**").allowedOrigins("*")
    }
}