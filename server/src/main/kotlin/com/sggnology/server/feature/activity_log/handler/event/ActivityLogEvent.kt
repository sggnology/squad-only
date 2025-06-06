package com.sggnology.server.feature.activity_log.handler.event

import com.sggnology.server.feature.activity_log.registration.data.model.RegisterActivityLogModel
import com.sggnology.server.feature.activity_log.type.ActivityLogType

/**
 * 활동 추적을 위한 기본 이벤트 클래스
 */
abstract class ActivityLogEvent(
    open val userId: String,
    open val username: String,
    open val type: ActivityLogType,
    open val description: String,
    open val targetId: String? = null,
    open val ip: String? = null
) {
    fun toRegisterActivityLogModel(): RegisterActivityLogModel {
        return RegisterActivityLogModel(
            userId = userId,
            username = username,
            type = type,
            description = description,
            targetId = targetId,
            ip = ip
        )
    }
}
