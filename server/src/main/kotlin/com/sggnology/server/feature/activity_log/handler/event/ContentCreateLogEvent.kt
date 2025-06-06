package com.sggnology.server.feature.activity_log.handler.event

import com.sggnology.server.common.constants.ActivityLogType

/**
 * 컨텐츠 생성 이벤트
 */
data class ContentCreateLogEvent(
    override val userId: String,
    override val username: String,
    val contentIdx: Long,
    val contentTitle: String,
    override val ip: String?
) : ActivityLogEvent(
    userId = userId,
    username = username,
    type = ActivityLogType.CONTENT_CREATE,
    description = "컨텐츠 등록: '$contentTitle'",
    targetId = contentIdx.toString(),
    ip = ip
)
