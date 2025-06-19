package com.sggnology.server.feature.activity_log.handler.event

import com.sggnology.server.common.constants.ActivityLogType

/**
 * 댓글 생성 활동 로그 이벤트
 */
data class CommentCreateLogEvent(
    override val userId: String,
    override val username: String,
    override val targetId: String,
    val contentIdx: Long,
    val commentContent: String,
    override val ip: String? = null
) : ActivityLogEvent(
    userId = userId,
    username = username,
    type = ActivityLogType.COMMENT_CREATE,
    description = "컨텐츠ID: $contentIdx 댓글을 작성했습니다: ${commentContent.take(50)}${if (commentContent.length > 50) "..." else ""}",
    targetId = targetId,
    ip = ip
)
