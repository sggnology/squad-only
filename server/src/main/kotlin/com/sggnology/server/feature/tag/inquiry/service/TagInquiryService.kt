package com.sggnology.server.feature.tag.inquiry.service

import com.sggnology.server.db.sql.repository.TagInfoRepository
import com.sggnology.server.feature.tag.inquiry.data.dto.res.TagInquiryResDto
import com.sggnology.server.feature.tag.inquiry.data.model.TagInquireModel
import org.springframework.data.domain.PageRequest
import org.springframework.data.web.PagedModel
import org.springframework.stereotype.Service

@Service
class TagInquiryService(
    private val tagInfoRepository: TagInfoRepository
) {

    fun execute(
        tagInquireModel: TagInquireModel
    ): PagedModel<TagInquiryResDto> {
        val pageable = PageRequest.of(
            tagInquireModel.page,
            tagInquireModel.size
        )

        val pagedResult = tagInfoRepository.inquire(
            pageable,
            tagInquireModel.search
        )
        val formattedResult = pagedResult.map {
            TagInquiryResDto.fromTagInfo(it)
        }

        return PagedModel(formattedResult)
    }
}