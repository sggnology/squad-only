package com.sggnology.server.feature.activity_log.handler.event

import com.sggnology.server.common.constants.ActivityLogType

/**
 * 프로필 업데이트 이벤트
 */
data class ProfileUpdateLogEvent(
    override val userId: String,
    override val username: String,
    val changes: String,
    override val ip: String?
) : ActivityLogEvent(
    userId = userId,
    username = username,
    type = ActivityLogType.PROFILE_UPDATE,
    description = "프로필 업데이트: $changes",
    ip = ip
)
