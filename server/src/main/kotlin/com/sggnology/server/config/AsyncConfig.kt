package com.sggnology.server.config

import com.sggnology.server.common.util.logger
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableAsync
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor
import java.util.concurrent.Executor

/**
 * 비동기 작업을 위한 설정
 * 
 * 활동 추적 이벤트 처리를 비동기로 수행하기 위한 설정입니다.
 */
@Configuration
@EnableAsync
class AsyncConfig {

    @Bean("activityInfoLogExecutor")
    fun activityTaskExecutor(): Executor {
        val executor = ThreadPoolTaskExecutor()

        // 기본 스레드 수
        executor.corePoolSize = 2

        // 최대 스레드 수
        executor.maxPoolSize = 5

        // 큐 용량 (대기 작업 수)
        executor.queueCapacity = 100

        // 스레드 이름 접두사
        executor.setThreadNamePrefix("ActivityLog-")

        // 스레드 생존 시간 (초)
        executor.keepAliveSeconds = 60

        // 거부 정책 (큐가 가득 찰 때)
        executor.setRejectedExecutionHandler { runnable, _ ->
            // 로그 기록 실패 시 메인 스레드에서 동기적으로 처리
            logger.error("Activity log queue is full, executing synchronously")
            runnable.run()
        }

        // 애플리케이션 종료 시 대기
        executor.setWaitForTasksToCompleteOnShutdown(true)
        executor.setAwaitTerminationSeconds(30)

        executor.initialize()
        return executor
    }
}
