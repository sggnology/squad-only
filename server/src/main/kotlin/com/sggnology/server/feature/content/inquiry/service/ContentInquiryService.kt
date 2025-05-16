package com.sggnology.server.feature.content.inquiry.service

import com.sggnology.server.db.sql.repository.ContentInfoRepository
import com.sggnology.server.feature.content.inquiry.data.dto.ContentInquiryResDto
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service

@Service
class ContentInquiryService(
    private val contentInfoRepository: ContentInfoRepository
) {

    fun execute(
        page: Int,
        size: Int
    ): Page<ContentInquiryResDto> {

        val pageInfo = PageRequest.of(
            page,
            size,
            Sort.by(Sort.Direction.DESC, "createdAt")
        )

        return contentInfoRepository.inquire(pageInfo)
    }
}