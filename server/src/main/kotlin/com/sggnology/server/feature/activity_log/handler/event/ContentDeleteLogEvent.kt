package com.sggnology.server.feature.activity_log.handler.event

import com.sggnology.server.common.constants.ActivityLogType

/**
 * 컨텐츠 삭제 이벤트
 */
data class ContentDeleteLogEvent(
    override val userId: String,
    override val username: String,
    val contentIds: List<Long>,
    override val ip: String?
) : ActivityLogEvent(
    userId = userId,
    username = username,
    type = ActivityLogType.CONTENT_DELETE,
    description = "컨텐츠 삭제: ${contentIds.size}개 항목",
    targetId = contentIds.joinToString(","),
    ip = ip
)