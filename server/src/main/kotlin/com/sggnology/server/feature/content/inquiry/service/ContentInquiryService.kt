package com.sggnology.server.feature.content.inquiry.service

import com.sggnology.server.common.annotation.WithUserInfo
import com.sggnology.server.common.util.UserInfoContextHolder
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

    @WithUserInfo
    fun execute(contentsInquiryModel: ContentsInquiryModel): PagedModel<ContentsInquiryResDto> {

        // 사용자 ID가 주어진 경우, 현재 사용자와 일치하는지 확인
        if(contentsInquiryModel.userId != null){
            if(UserInfoContextHolder.getUserInfo().userId != contentsInquiryModel.userId){
                throw IllegalArgumentException("사용자 ID가 일치하지 않습니다.")
            }
        }

        val pageInfo = PageRequest.of(
            contentsInquiryModel.page,
            contentsInquiryModel.size,
            Sort.by(Sort.Direction.DESC, "createdAt")
        )

        val pagedResult = contentInfoRepository.inquire(
            pageInfo,
            contentsInquiryModel.search,
            contentsInquiryModel.tags,
            contentsInquiryModel.userId
        )
        val formattedResult = pagedResult.map { ContentsInquiryResDto.fromContentInfo(it) }

        return PagedModel(formattedResult)
    }
}