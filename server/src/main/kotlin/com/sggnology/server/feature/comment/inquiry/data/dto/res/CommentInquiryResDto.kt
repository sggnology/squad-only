package com.sggnology.server.feature.comment.inquiry.data.dto.res

import com.sggnology.server.db.sql.entity.CommentInfo
import java.time.LocalDateTime

data class CommentInquiryResDto(
    val idx: Long,
    val contentIdx: Long,
    val comment: String,
    val userId: String,
    val username: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
) {
    companion object {
        fun fromCommentInfo(commentInfo: CommentInfo): CommentInquiryResDto {
            return CommentInquiryResDto(
                idx = commentInfo.idx,
                contentIdx = commentInfo.contentInfo.idx,
                comment = commentInfo.comment,
                userId = commentInfo.registeredUser.userId,
                username = if(!commentInfo.registeredUser.nickname.isNullOrEmpty()) {
                    commentInfo.registeredUser.nickname!!
                } else {
                    commentInfo.registeredUser.name
                },
                createdAt = commentInfo.createdAt,
                updatedAt = commentInfo.updatedAt
            )
        }
    }
}
