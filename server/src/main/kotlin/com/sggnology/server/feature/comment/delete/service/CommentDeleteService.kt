package com.sggnology.server.feature.comment.delete.service

import com.sggnology.server.common.annotation.WithUserInfo
import com.sggnology.server.common.util.UserInfoContextHolder
import com.sggnology.server.db.sql.repository.CommentInfoRepository
import com.sggnology.server.feature.comment.delete.data.model.CommentDeleteModel
import com.sggnology.server.feature.activity_log.handler.event.CommentDeleteLogEvent
import org.springframework.context.ApplicationEventPublisher
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CommentDeleteService(
    private val commentInfoRepository: CommentInfoRepository,
    private val applicationEventPublisher: ApplicationEventPublisher
) {

    @WithUserInfo
    @Transactional
    fun execute(commentDeleteModel: CommentDeleteModel) {
        // 댓글 조회
        val commentInfo = commentInfoRepository.findByIdxAndIsDeletedFalse(commentDeleteModel.commentIdx)
            ?: throw IllegalArgumentException("댓글을 찾을 수 없습니다. IDX: ${commentDeleteModel.commentIdx}")

        val userInfo = UserInfoContextHolder.getUserInfo()
        val authentication = SecurityContextHolder.getContext().authentication

        // 권한 확인 - 댓글 작성자 또는 관리자만 삭제 가능
        val isAdmin = authentication.authorities.any { it.authority == "ROLE_ADMIN" }
          if (!isAdmin && commentInfo.user.idx != userInfo.idx) {
            throw IllegalArgumentException("댓글을 삭제할 권한이 없습니다.")
        }

        // 삭제할 댓글 내용 저장 (로그용)
        val deletedContent = commentInfo.comment
        val contentIdx = commentInfo.contentInfo.idx

        // 소프트 삭제
        commentInfo.isDeleted = true

        commentInfoRepository.save(commentInfo)

        // 활동 로그 이벤트 발행
        applicationEventPublisher.publishEvent(
            CommentDeleteLogEvent(
                userId = userInfo.userId,
                username = userInfo.name,
                targetId = commentInfo.idx.toString(),
                contentIdx = contentIdx,
                deletedContent = deletedContent
            )
        )
    }
}
