package com.sggnology.server.feature.activity_log.registration.data.model

import com.sggnology.server.db.sql.entity.ActivityLogInfo
import com.sggnology.server.feature.activity_log.type.ActivityLogType

data class RegisterActivityLogModel(
    val userId: String,
    val username: String,
    val type: ActivityLogType,
    val description: String,
    val targetId: String? = null,
    val ip: String? = null
) {
    fun toActivityLogInfo(): ActivityLogInfo {
        return ActivityLogInfo(
            userId = userId,
            username = username,
            type = type,
            description = description,
            targetId = targetId,
            ip = ip
        )
    }
}
