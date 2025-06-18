package com.sggnology.server.feature.activity_log.handler.event

import com.sggnology.server.common.constants.ActivityLogType

/**
 * 댓글 삭제 활동 로그 이벤트
 */
data class CommentDeleteLogEvent(
    override val userId: String,
    override val username: String,
    override val targetId: String,
    val contentIdx: Long,
    val deletedContent: String,
    override val ip: String? = null
) : ActivityLogEvent(
    userId = userId,
    username = username,
    type = ActivityLogType.COMMENT_DELETE,
    description = "댓글을 삭제했습니다: ${deletedContent.take(50)}${if (deletedContent.length > 50) "..." else ""}",
    targetId = targetId,
    ip = ip
)
