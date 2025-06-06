package com.sggnology.server.feature.content.delete.service

import com.sggnology.server.common.annotation.WithUserInfo
import com.sggnology.server.common.util.ClientIPHolder
import com.sggnology.server.common.util.UserInfoContextHolder
import com.sggnology.server.db.sql.repository.ContentInfoRepository
import com.sggnology.server.feature.activity_log.handler.event.ContentDeleteLogEvent
import com.sggnology.server.feature.content.delete.data.model.ContentDeleteModel
import com.sggnology.server.common.util.logger
import org.springframework.context.ApplicationEventPublisher
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ContentDeleteService(
    private val contentInfoRepository: ContentInfoRepository,
    private val eventPublisher: ApplicationEventPublisher
) {

    @WithUserInfo
    @Transactional
    fun execute(
        contentDeleteModel: ContentDeleteModel
    ) {
        val contentInfos = contentInfoRepository.findByIdxIn(contentDeleteModel.idxs)

        // 권한 확인
        val authentication = SecurityContextHolder.getContext().authentication
        val userInfo = UserInfoContextHolder.getUserInfo()

        // 관리자일 경우 수정 가능
        val isAdmin = authentication.authorities.any { it.authority == "ROLE_ADMIN" }

        // 관리자가 아닌데 본인이 등록한 컨텐츠가 아닐 경우 예외 발생
        if(!isAdmin){
            for (contentInfo in contentInfos) {
                // 컨텐츠가 존재하지 않거나 이미 삭제된 경우
                if (contentInfo.registeredUser == userInfo) {
                    throw IllegalArgumentException(
                        "Content with ID ${contentInfo.idx} do not have permission to delete this content."
                    )
                }
            }
        }        // 컨텐츠 삭제
        val deletedContents = contentInfoRepository.saveAll(
            contentInfos.map {
                it.isDeleted = true
                it
            }
        )

        logger.info("사용자: ${userInfo.idx} 가, 컨텐츠 IDs: ${contentDeleteModel.idxs} 를 삭제했습니다.")

        // 각 삭제된 컨텐츠에 대해 삭제 이벤트 발행
        deletedContents.forEach { contentInfo ->
            eventPublisher.publishEvent(
                ContentDeleteLogEvent(
                    userId = userInfo.userId,
                    username = userInfo.name,
                    contentIds = contentInfos.map { it.idx },
                    ip = ClientIPHolder.get()
                )
            )
        }
    }
}