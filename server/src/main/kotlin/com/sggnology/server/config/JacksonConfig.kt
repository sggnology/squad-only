package com.sggnology.server.config

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import java.text.SimpleDateFormat
import java.util.TimeZone

@Configuration
class JacksonConfig {

    @Bean
    @Primary
    fun objectMapper(): ObjectMapper {
        return ObjectMapper().apply {
            registerModule(JavaTimeModule())
            registerKotlinModule()
            
            // 🔥 타임스탬프 대신 ISO8601 문자열 사용
            disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            disable(SerializationFeature.WRITE_DURATIONS_AS_TIMESTAMPS)
            
            // 🔥 ISO8601 패턴 설정 (application.yml의 date-format과 동일)
            setDateFormat(SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"))
            
            println("✅ Jackson 설정 완료: ISO8601 UTC 형식으로 직렬화")
        }
    }
}