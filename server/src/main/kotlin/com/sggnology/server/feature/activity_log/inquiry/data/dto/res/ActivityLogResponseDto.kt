package com.sggnology.server.feature.activity_log.inquiry.data.dto.res

import com.sggnology.server.db.sql.entity.ActivityLogInfo
import com.sggnology.server.common.constants.ActivityLogType
import java.time.LocalDateTime

data class ActivityLogResponseDto(
    val idx: Long,
    val userId: String,
    val username: String,
    val type: ActivityLogType,
    val description: String,
    val targetId: String?,
    val ip: String?,
    val createdAt: LocalDateTime
) {
    companion object {
        fun from(entity: ActivityLogInfo) = ActivityLogResponseDto(
            idx = entity.idx,
            userId = entity.userId,
            username = entity.username,
            type = entity.type,
            description = entity.description,
            targetId = entity.targetId,
            ip = entity.ip,
            createdAt = entity.createdAt
        )
    }
}