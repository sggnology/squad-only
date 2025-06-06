package com.sggnology.server.feature.activity_log.handler.event

import com.sggnology.server.feature.activity_log.type.ActivityLogType

/**
 * 컨텐츠 수정 이벤트
 */
data class ContentUpdateLogEvent(
    override val userId: String,
    override val username: String,
    val contentIdx: Long,
    val contentTitle: String,
    override val ip: String?
) : ActivityLogEvent(
    userId = userId,
    username = username,
    type = ActivityLogType.CONTENT_UPDATE,
    description = "컨텐츠 수정: '$contentTitle'",
    targetId = contentIdx.toString(),
    ip = ip
)
