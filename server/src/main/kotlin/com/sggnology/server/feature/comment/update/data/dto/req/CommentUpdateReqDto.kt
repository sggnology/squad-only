package com.sggnology.server.feature.comment.update.data.dto.req

import com.sggnology.server.feature.comment.update.data.model.CommentUpdateModel
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class CommentUpdateReqDto(
    @field:NotBlank(message = "댓글 내용을 입력해주세요.")
    @field:Size(max = 1000, message = "댓글은 1000자 이하로 입력해주세요.")
    val comment: String
) {
    fun toCommentUpdateModel(commentIdx: Long): CommentUpdateModel {
        return CommentUpdateModel(
            commentIdx = commentIdx,
            comment = comment.trim()
        )
    }
}
