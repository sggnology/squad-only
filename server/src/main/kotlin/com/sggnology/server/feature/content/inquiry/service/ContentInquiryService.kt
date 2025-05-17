package com.sggnology.server.feature.content.inquiry.service

import com.sggnology.server.db.sql.repository.ContentInfoRepository
import com.sggnology.server.feature.content.inquiry.data.dto.ContentInquiryResDto
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.data.web.PagedModel
import org.springframework.stereotype.Service

@Service
class ContentInquiryService(
    private val contentInfoRepository: ContentInfoRepository
) {

    fun execute(
        page: Int,
        size: Int
    ): PagedModel<ContentInquiryResDto> {

        val pageInfo = PageRequest.of(
            page,
            size,
            Sort.by(Sort.Direction.DESC, "createdAt")
        )

        val pagedResult = contentInfoRepository.inquire(pageInfo)
        val formattedResult = pagedResult.map { eachContent ->
            ContentInquiryResDto(
                idx = eachContent.idx,
                fileIds = eachContent.fileInfos.map { it.idx }.toMutableSet(),
                title = eachContent.title,
                location = eachContent.location,
                description = eachContent.description,
                createdAt = eachContent.createdAt,
                tags = eachContent.contentTags.map { it.tag.name }.toMutableSet()
            )
        }

        return PagedModel(formattedResult)
    }
}