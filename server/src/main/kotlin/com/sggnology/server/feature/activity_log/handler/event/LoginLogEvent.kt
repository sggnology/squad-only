package com.sggnology.server.feature.activity_log.handler.event

import com.sggnology.server.feature.activity_log.type.ActivityLogType

/**
 * 로그인 이벤트
 */
data class LoginLogEvent(
    override val userId: String,
    override val username: String,
    override val ip: String?
) : ActivityLogEvent(
    userId = userId,
    username = username,
    type = ActivityLogType.LOGIN,
    description = "사용자 로그인",
    ip = ip
)
