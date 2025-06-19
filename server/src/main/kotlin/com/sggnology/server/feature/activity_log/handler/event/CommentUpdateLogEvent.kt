package com.sggnology.server.feature.activity_log.handler.event

import com.sggnology.server.common.constants.ActivityLogType

/**
 * 댓글 수정 활동 로그 이벤트
 */
data class CommentUpdateLogEvent(
    override val userId: String,
    override val username: String,
    override val targetId: String,
    val contentIdx: Long,
    val updateComment: String,
    override val ip: String? = null
) : ActivityLogEvent(
    userId = userId,
    username = username,
    type = ActivityLogType.COMMENT_UPDATE,
    description = "컨텐츠: $contentIdx 댓글을 수정했습니다: ${updateComment.take(50)}${if (updateComment.length > 50) "..." else ""}",
    targetId = targetId,
    ip = ip
)
