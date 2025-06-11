package com.sggnology.server.feature.comment.delete.data.dto.req

import com.sggnology.server.feature.comment.delete.data.model.CommentDeleteModel
import jakarta.validation.constraints.Positive

data class CommentDeleteReqDto(
    @field:Positive(message = "유효한 댓글 ID를 입력해주세요.")
    val commentIdx: Long
) {
    fun toCommentDeleteModel(): CommentDeleteModel {
        return CommentDeleteModel(
            commentIdx = commentIdx
        )
    }
}
