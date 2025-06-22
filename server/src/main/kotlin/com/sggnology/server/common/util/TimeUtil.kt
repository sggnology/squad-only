package com.sggnology.server.common.util

import java.time.Instant
import java.time.ZoneOffset

object TimeUtil {
    
    /**
     * 항상 UTC 기준 현재 시간 반환
     * 서버 타임존과 무관하게 UTC 보장
     */
    fun nowUtc(): Instant {
        return Instant.now()  // Instant는 항상 UTC 기준
    }
    
    /**
     * 시간 생성 시 검증
     */
    fun createUtcInstant(year: Int, month: Int, day: Int, hour: Int, minute: Int, second: Int): Instant {
        return java.time.LocalDateTime.of(year, month, day, hour, minute, second)
            .atOffset(ZoneOffset.UTC)  // 명시적으로 UTC 지정
            .toInstant()
    }
    
    /**
     * Instant를 ISO8601 UTC 문자열로 변환
     */
    fun instantToIso8601Utc(instant: Instant): String {
        return instant.toString() // 자동으로 "2024-06-21T09:00:00.000Z" 형식
    }
    
    /**
     * ISO8601 문자열을 Instant로 변환
     */
    fun iso8601ToInstant(iso8601: String): Instant {
        return Instant.parse(iso8601)
    }
}
