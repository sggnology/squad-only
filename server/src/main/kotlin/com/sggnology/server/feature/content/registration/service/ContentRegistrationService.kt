package com.sggnology.server.feature.content.registration.service

import com.sggnology.server.db.sql.entity.ContentInfo
import com.sggnology.server.db.sql.entity.ContentTagInfo
import com.sggnology.server.db.sql.repository.ContentInfoRepository
import com.sggnology.server.db.sql.repository.TagInfoRepository
import com.sggnology.server.db.sql.repository.UserInfoRepository
import com.sggnology.server.feature.content.registration.data.dto.ContentRegistrationReqDto
import com.sggnology.server.feature.file.upload.data.model.FileAttachToContentModel
import com.sggnology.server.feature.file.upload.data.model.FileMoveToStorageModel
import com.sggnology.server.feature.file.upload.service.FileUploadService
import com.sggnology.server.feature.tag.data.dto.req.TagRegistrationReqDto
import com.sggnology.server.feature.tag.domain.TagManager
import com.sggnology.server.util.logger
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ContentRegistrationService(
    private val contentInfoRepository: ContentInfoRepository,
    private val userInfoRepository: UserInfoRepository,
    private val tagInfoRepository: TagInfoRepository,
    private val fileUploadService: FileUploadService
) {

    @Transactional
    fun execute(
        registrationReqDto: ContentRegistrationReqDto
    ) {

        val tagManager = TagManager(tagInfoRepository)
        val tagRegistrationReqDto = TagRegistrationReqDto(tagNames = registrationReqDto.tags)
        val tagRegistrationModel = tagManager.command(
            tagRegistrationReqDto.toTagRegisterModel()
        )

        val newFileInfos = fileUploadService.execute(
            FileMoveToStorageModel(
                fileIdxs = registrationReqDto.newFileIds
            )
        )

        val newContentInfo = ContentInfo(
            title = registrationReqDto.title,
            description = registrationReqDto.title,
            location = registrationReqDto.location,
        )

        // 사용자 연결
        val authentication = SecurityContextHolder.getContext().authentication
        val userId = authentication.name
        val registeredUser = userInfoRepository.findByUserId(userId)
            ?: throw IllegalArgumentException("등록된 사용자를 찾을 수 없습니다: $userId")
        newContentInfo.registeredUser = registeredUser

        // 파일 연결
        fileUploadService.execute(
            FileAttachToContentModel(
                fileInfos = newFileInfos,
                contentInfo = newContentInfo
            )
        )

        // 태그 연결
        newContentInfo.contentTags.addAll(
            tagRegistrationModel.combinedTagInfos.map { combinedTagInfo ->
                ContentTagInfo(
                    content = newContentInfo,
                    tag = combinedTagInfo
                )
            }
        )

        // 컨텐츠 등록에 대한 정보 로깅
        logger.info("Registering new content: ${newContentInfo.title} by user: $userId(idx: ${registeredUser.idx})")

        contentInfoRepository.save(newContentInfo)
    }
}