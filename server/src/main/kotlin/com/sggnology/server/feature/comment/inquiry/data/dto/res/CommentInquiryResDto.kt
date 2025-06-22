package com.sggnology.server.feature.comment.inquiry.data.dto.res

import com.sggnology.server.db.sql.entity.CommentInfo
import java.time.Instant

data class CommentInquiryResDto(
    val idx: Long,
    val contentIdx: Long,
    val comment: String,
    val userId: String,
    val username: String,
    val createdAt: Instant,
    val updatedAt: Instant
) {
    companion object {
        fun fromCommentInfo(commentInfo: CommentInfo): CommentInquiryResDto {
            return CommentInquiryResDto(
                idx = commentInfo.idx,
                contentIdx = commentInfo.contentInfo.idx,
                comment = commentInfo.comment,
                userId = commentInfo.registeredUser.userId,
                username = if (!commentInfo.registeredUser.nickname.isNullOrEmpty()) {
                    commentInfo.registeredUser.nickname!!
                } else {
                    commentInfo.registeredUser.name
                },
                createdAt = commentInfo.createdAt
                    ?: throw IllegalStateException("createdAt should not be null for persisted entity"),
                updatedAt = commentInfo.updatedAt
                    ?: throw IllegalStateException("updatedAt should not be null for persisted entity")
            )
        }
    }
}
