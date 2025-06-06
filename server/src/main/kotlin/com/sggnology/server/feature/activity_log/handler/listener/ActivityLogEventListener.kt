package com.sggnology.server.feature.activity_log.handler.listener

import com.sggnology.server.feature.activity_log.registration.service.ActivityLogRegistrationService
import com.sggnology.server.feature.activity_log.handler.event.ContentCreateLogEvent
import com.sggnology.server.feature.activity_log.handler.event.ContentDeleteLogEvent
import com.sggnology.server.feature.activity_log.handler.event.ContentUpdateLogEvent
import com.sggnology.server.feature.activity_log.handler.event.LoginLogEvent
import com.sggnology.server.feature.activity_log.handler.event.ProfileUpdateLogEvent
import org.springframework.context.event.EventListener
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Component

/**
 * 활동 추적 이벤트 리스너
 * 
 * 각종 활동 이벤트를 수신하여 ActivityService를 통해 로그를 기록합니다.
 * @Async 어노테이션을 통해 비동기로 처리하여 메인 비즈니스 로직에 영향을 주지 않습니다.
 */
@Component
class ActivityLogEventListener(
    private val activityLogRegistrationService: ActivityLogRegistrationService
) {

    @Async("activityInfoLogExecutor")
    @EventListener
    fun handleLoginEvent(event: LoginLogEvent) {
        activityLogRegistrationService.execute(
            event.toRegisterActivityLogModel()
        )
    }

    @Async("activityInfoLogExecutor")
    @EventListener
    fun handleContentCreateEvent(event: ContentCreateLogEvent) {
        activityLogRegistrationService.execute(
            event.toRegisterActivityLogModel()
        )
    }

    @Async("activityInfoLogExecutor")
    @EventListener
    fun handleContentUpdateEvent(event: ContentUpdateLogEvent) {
        activityLogRegistrationService.execute(
            event.toRegisterActivityLogModel()
        )
    }

    @Async("activityInfoLogExecutor")
    @EventListener
    fun handleContentDeleteEvent(event: ContentDeleteLogEvent) {
        activityLogRegistrationService.execute(
            event.toRegisterActivityLogModel()
        )
    }

    @Async("activityInfoLogExecutor")
    @EventListener
    fun handleProfileUpdateEvent(event: ProfileUpdateLogEvent) {
        activityLogRegistrationService.execute(
            event.toRegisterActivityLogModel()
        )
    }
}
