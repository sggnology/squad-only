package com.sggnology.server.config

import jakarta.annotation.PostConstruct
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Component

@Component
class DatabaseTimezoneValidator(
    private val jdbcTemplate: JdbcTemplate
) {

    @PostConstruct
    fun validateDatabaseTimezone() {
        try {
            println("🗄️  데이터베이스 타임존 검증 시작...")
            
            // PostgreSQL 세션 타임존 확인
            val currentTimezone = jdbcTemplate.queryForObject(
                "SHOW timezone", 
                String::class.java
            )
            
            println("🗄️  Database Session TimeZone: $currentTimezone")
            
            if (currentTimezone != "UTC") {
                // 강제로 UTC 설정 시도
                jdbcTemplate.execute("SET timezone = 'UTC'")
                
                val newTimezone = jdbcTemplate.queryForObject(
                    "SHOW timezone", 
                    String::class.java
                )
                
                if (newTimezone != "UTC") {
                    throw IllegalStateException(
                        "데이터베이스 타임존을 UTC로 설정할 수 없습니다. " +
                        "현재: $currentTimezone, 시도 후: $newTimezone"
                    )
                }
                
                println("✅ Database 타임존이 UTC로 강제 설정되었습니다.")
            } else {
                println("✅ Database 세션 타임존이 이미 UTC로 설정되어 있습니다.")
            }
            
            // 현재 DB 시간 확인
            val dbTime = jdbcTemplate.queryForObject(
                "SELECT NOW()", 
                java.sql.Timestamp::class.java
            )
            println("🗄️  Database Current Time: $dbTime")
            
        } catch (e: Exception) {
            println("❌ Database 타임존 검증 실패: ${e.message}")
            throw e
        }
    }
}
