package com.sggnology.server.feature.comment.registration.service

import com.sggnology.server.common.annotation.WithUserInfo
import com.sggnology.server.common.util.UserInfoContextHolder
import com.sggnology.server.db.sql.entity.CommentInfo
import com.sggnology.server.db.sql.repository.CommentInfoRepository
import com.sggnology.server.db.sql.repository.ContentInfoRepository
import com.sggnology.server.feature.comment.registration.data.model.CommentRegisterModel
import com.sggnology.server.feature.activity_log.handler.event.CommentCreateLogEvent
import org.springframework.context.ApplicationEventPublisher
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CommentRegistrationService(
    private val commentInfoRepository: CommentInfoRepository,
    private val contentInfoRepository: ContentInfoRepository,
    private val applicationEventPublisher: ApplicationEventPublisher
) {

    @WithUserInfo
    @Transactional
    fun execute(commentRegisterModel: CommentRegisterModel) {
        // 컨텐츠 존재 확인
        val contentInfo = contentInfoRepository.findById(commentRegisterModel.contentIdx)
            .orElseThrow { IllegalArgumentException("컨텐츠를 찾을 수 없습니다. IDX: ${commentRegisterModel.contentIdx}") }

        // 삭제된 컨텐츠인지 확인
        if (contentInfo.isDeleted) {
            throw IllegalArgumentException("삭제된 컨텐츠에는 댓글을 작성할 수 없습니다.")
        }

        val userInfo = UserInfoContextHolder.getUserInfo()        // 댓글 생성
        val commentInfo = CommentInfo(
            contentInfo = contentInfo,
            registeredUser = userInfo,
            comment = commentRegisterModel.comment
        )

        val savedComment = commentInfoRepository.save(commentInfo)

        // 활동 로그 이벤트 발행
        applicationEventPublisher.publishEvent(
            CommentCreateLogEvent(
                userId = userInfo.userId,
                username = userInfo.name,
                targetId = savedComment.idx.toString(),
                contentIdx = commentRegisterModel.contentIdx,
                commentContent = commentRegisterModel.comment
            )
        )
    }
}
