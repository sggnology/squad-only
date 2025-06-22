package com.sggnology.server

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaAuditing
import java.time.Instant
import java.time.ZoneId
import java.util.TimeZone

@EnableJpaAuditing
@SpringBootApplication
class SquadOnlyApplication

fun main(args: Array<String>) {
    // JVM 타임존을 UTC로 강제 설정
    TimeZone.setDefault(TimeZone.getTimeZone("UTC"))
    System.setProperty("user.timezone", "UTC")

    printTimezoneInfo()

    runApplication<SquadOnlyApplication>(*args)
}

/**
 * 타임존 설정 상태를 시각적으로 출력
 *
 * - Devtools 사용으로 인해 두번 출력되기는 하지만, jar 로 실행할 때는 한 번만 출력됩니다.
 */
private fun printTimezoneInfo() {
    println("=".repeat(60))
    println("🕐 TIMEZONE CONFIGURATION")
    println("=".repeat(60))
    println("🌍 JVM Default TimeZone: ${TimeZone.getDefault().id}")
    println("🌍 System Property user.timezone: ${System.getProperty("user.timezone")}")
    println("🌍 ZoneId.systemDefault(): ${ZoneId.systemDefault()}")
    println("⏰ Current UTC Time: ${Instant.now()}")
    println("⏰ Current Local Time: ${java.time.LocalDateTime.now()}")
    println("=".repeat(60))

    // 타임존 검증
    val currentTz = TimeZone.getDefault()
    if (currentTz.id != "UTC") {
        System.err.println("❌ ERROR: JVM 타임존이 UTC로 설정되지 않았습니다: ${currentTz.id}")
        throw IllegalStateException("JVM 타임존이 UTC로 설정되지 않았습니다: ${currentTz.id}")
    } else {
        println("✅ SUCCESS: JVM 타임존이 UTC로 정상 설정되었습니다.")
    }
}
