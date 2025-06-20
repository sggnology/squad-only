package com.sggnology.server.feature.content.update.service

import com.sggnology.server.common.annotation.WithUserInfo
import com.sggnology.server.common.util.ClientIPHolder
import com.sggnology.server.common.util.UserInfoContextHolder
import com.sggnology.server.db.sql.entity.ContentTagInfo
import com.sggnology.server.db.sql.repository.ContentInfoRepository
import com.sggnology.server.db.sql.repository.TagInfoRepository
import com.sggnology.server.feature.activity_log.handler.event.ContentUpdateLogEvent
import com.sggnology.server.feature.content.update.data.model.ContentUpdateModel
import com.sggnology.server.feature.file.upload.data.model.FileAttachToContentModel
import com.sggnology.server.feature.file.upload.data.model.FileMoveToStorageModel
import com.sggnology.server.feature.file.upload.service.FileUploadService
import com.sggnology.server.feature.tag.domain.data.dto.req.TagRegistrationReqDto
import com.sggnology.server.feature.tag.domain.TagManager
import com.sggnology.server.common.util.logger
import org.springframework.context.ApplicationEventPublisher
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ContentUpdateService(
    private val contentInfoRepository: ContentInfoRepository,
    private val tagInfoRepository: TagInfoRepository,
    private val fileUploadService: FileUploadService,
    private val eventPublisher: ApplicationEventPublisher
) {

    @WithUserInfo
    @Transactional
    fun execute(contentUpdateModel: ContentUpdateModel) {
        // 컨텐츠 조회
        val contentInfo = contentInfoRepository.findById(contentUpdateModel.idx)
            .orElseThrow { IllegalArgumentException("컨텐츠를 찾을 수 없습니다. IDX: ${contentUpdateModel.idx}") }

        // 권한 확인
        val authentication = SecurityContextHolder.getContext().authentication
        val userInfo = UserInfoContextHolder.getUserInfo()

        // 관리자일 경우 수정 가능
        val isAdmin = authentication.authorities.any { it.authority == "ROLE_ADMIN" }

        if(!isAdmin){
            // 컨텐츠 소유자가 아닌 경우 권한 없음
            val isOwner = contentInfo.registeredUser == userInfo

            if (!isOwner) {
                throw IllegalArgumentException("이 컨텐츠를 수정할 권한이 없습니다.")
            }
        }

        // 컨텐츠 정보 업데이트
        contentInfo.title = contentUpdateModel.title
        contentInfo.description = contentUpdateModel.description
        contentInfo.location = contentUpdateModel.location

        // 새로운 파일이 있는 경우 기존 파일 연결 해제 및 새 파일 연결
        if (contentUpdateModel.newFileIds.isNotEmpty()) {
            // 기존 파일 연결 해제
            contentInfo.fileInfos.forEach {
                it.contentInfo = null
            }
            contentInfo.fileInfos.clear()
            
            // 새로운 파일을 스토리지로 이동
            val newFileInfos = fileUploadService.execute(
                FileMoveToStorageModel(
                    fileIdxs = contentUpdateModel.newFileIds
                )
            )
            
            // 새로운 파일과 컨텐츠 연결
            fileUploadService.execute(
                FileAttachToContentModel(
                    fileInfos = newFileInfos,
                    contentInfo = contentInfo
                )
            )
        }

        // 기존 태그 관계 삭제
        contentInfo.contentTags.clear()

        // 새로운 태그 추가
        if (contentUpdateModel.tags.isNotEmpty()) {
            val tagManager = TagManager(tagInfoRepository)
            val tagRegistrationReqDto = TagRegistrationReqDto(tagNames = contentUpdateModel.tags)
            val tagRegistrationModel = tagManager.command(
                tagRegistrationReqDto.toTagRegisterModel()
            )
            
            // 태그와 컨텐츠 연결
            contentInfo.contentTags.addAll(
                tagRegistrationModel.combinedTagInfos.map { tagInfo ->
                    ContentTagInfo(
                        content = contentInfo,
                        tag = tagInfo
                    )
                }
            )
        }        // 컨텐츠 수정 정보 로깅
        logger.info(
            "컨텐츠 수정: IDX='${contentInfo.idx}', Title='${contentInfo.title}', 사용자 ='${userInfo.userId}' "
        )

        // 컨텐츠 저장
        contentInfoRepository.save(contentInfo)

        // 컨텐츠 수정 이벤트 발행
        eventPublisher.publishEvent(
            ContentUpdateLogEvent(
                userId = userInfo.userId,
                username = userInfo.name,
                contentIdx = contentInfo.idx,
                contentTitle = contentInfo.title,
                ip = ClientIPHolder.get()
            )
        )
    }
}
