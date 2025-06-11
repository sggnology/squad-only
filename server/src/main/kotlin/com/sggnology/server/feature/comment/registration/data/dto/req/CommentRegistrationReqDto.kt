package com.sggnology.server.feature.comment.registration.data.dto.req

import com.sggnology.server.feature.comment.registration.data.model.CommentRegisterModel
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class CommentRegistrationReqDto(
    @field:NotBlank(message = "댓글 내용을 입력해주세요.")
    @field:Size(max = 1000, message = "댓글은 1000자 이하로 입력해주세요.")
    val comment: String
) {
    fun toCommentRegisterModel(contentIdx: Long): CommentRegisterModel {
        return CommentRegisterModel(
            contentIdx = contentIdx,
            comment = comment.trim()
        )
    }
}
