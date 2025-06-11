package com.sggnology.server.feature.comment.inquiry.service

import com.sggnology.server.db.sql.repository.CommentInfoRepository
import com.sggnology.server.feature.comment.inquiry.data.dto.res.CommentInquiryResDto
import com.sggnology.server.feature.comment.inquiry.data.model.CommentInquireModel
import org.springframework.data.domain.PageRequest
import org.springframework.data.web.PagedModel
import org.springframework.stereotype.Service

@Service
class CommentInquiryService(
    private val commentInfoRepository: CommentInfoRepository
) {

    fun execute(commentInquireModel: CommentInquireModel): PagedModel<CommentInquiryResDto> {
        val pageable = PageRequest.of(
            commentInquireModel.page,
            commentInquireModel.size
        )

        val pagedResult = commentInfoRepository.inquire(
            pageable,
            commentInquireModel.contentIdx
        )

        val formattedResult = pagedResult.map { CommentInquiryResDto.fromCommentInfo(it) }

        return PagedModel(formattedResult)
    }
}
