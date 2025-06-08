package com.sggnology.server.feature.content.inquiry.service

import com.sggnology.server.db.sql.repository.ContentInfoRepository
import com.sggnology.server.feature.content.inquiry.data.dto.ContentInquiryResDto
import com.sggnology.server.feature.content.inquiry.data.dto.ContentsInquiryResDto
import com.sggnology.server.feature.content.inquiry.data.model.ContentInquiryModel
import com.sggnology.server.feature.content.inquiry.data.model.ContentsInquiryModel
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.data.web.PagedModel
import org.springframework.stereotype.Service

@Service
class ContentInquiryService(
    private val contentInfoRepository: ContentInfoRepository
) {

    fun execute(contentInquiryModel: ContentInquiryModel): ContentInquiryResDto {
        val contentInfo = contentInfoRepository.findById(contentInquiryModel.idx)
            .orElseThrow { IllegalArgumentException("컨텐츠를 찾을 수 없습니다. IDX: ${contentInquiryModel.idx}") }

        return ContentInquiryResDto.fromContentInfo(contentInfo)
    }

    fun execute(contentsInquiryModel: ContentsInquiryModel): PagedModel<ContentsInquiryResDto> {

        val pageInfo = PageRequest.of(
            contentsInquiryModel.page,
            contentsInquiryModel.size,
            Sort.by(Sort.Direction.DESC, "createdAt")
        )

        val pagedResult = contentInfoRepository.inquire(
            pageInfo,
            contentsInquiryModel.search,
            contentsInquiryModel.tags
        )
        val formattedResult = pagedResult.map { ContentsInquiryResDto.fromContentInfo(it) }

        return PagedModel(formattedResult)
    }
}