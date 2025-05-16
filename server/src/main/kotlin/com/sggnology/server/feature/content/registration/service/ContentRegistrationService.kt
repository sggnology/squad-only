package com.sggnology.server.feature.content.registration.service

import com.sggnology.server.db.sql.entity.ContentInfo
import com.sggnology.server.db.sql.entity.ContentTagInfo
import com.sggnology.server.db.sql.repository.ContentInfoRepository
import com.sggnology.server.db.sql.repository.TagInfoRepository
import com.sggnology.server.feature.content.registration.data.dto.ContentRegistrationReqDto
import com.sggnology.server.feature.tag.data.dto.TagRegistrationReqDto
import com.sggnology.server.feature.tag.domain.TagManager
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ContentRegistrationService(
    private val contentInfoRepository: ContentInfoRepository,
    private val tagInfoRepository: TagInfoRepository
) {

    @Transactional
    fun execute(
        registrationReqDto: ContentRegistrationReqDto
    ) {

        val tagManager = TagManager(tagInfoRepository)
        val tagRegistrationReqDto = TagRegistrationReqDto(tagNames = registrationReqDto.tags)
        val tagRegistrationModel = tagManager.command(tagRegistrationReqDto)

        // TODO: 이미지 연결, 등록자 등록
        val newContentInfo = ContentInfo(
            title = registrationReqDto.title,
            description = registrationReqDto.title,
            location = registrationReqDto.location,
        )

        newContentInfo.contentTags.addAll(
            tagRegistrationModel.combinedTagInfos.map { combinedTagInfo ->
                ContentTagInfo(
                    content = newContentInfo,
                    tag = combinedTagInfo
                )
            }
        )

        contentInfoRepository.save(newContentInfo)
    }
}