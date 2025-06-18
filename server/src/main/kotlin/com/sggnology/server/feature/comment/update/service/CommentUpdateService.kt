package com.sggnology.server.feature.comment.update.service

import com.sggnology.server.common.annotation.WithUserInfo
import com.sggnology.server.common.util.UserInfoContextHolder
import com.sggnology.server.db.sql.repository.CommentInfoRepository
import com.sggnology.server.feature.comment.update.data.model.CommentUpdateModel
import com.sggnology.server.feature.activity_log.handler.event.CommentUpdateLogEvent
import org.springframework.context.ApplicationEventPublisher
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CommentUpdateService(
    private val commentInfoRepository: CommentInfoRepository,
    private val applicationEventPublisher: ApplicationEventPublisher
) {

    @WithUserInfo
    @Transactional
    fun execute(commentUpdateModel: CommentUpdateModel) {
        // 댓글 조회
        val commentInfo = commentInfoRepository.findByIdxAndIsDeletedFalse(commentUpdateModel.commentIdx)
            ?: throw IllegalArgumentException("댓글을 찾을 수 없습니다. IDX: ${commentUpdateModel.commentIdx}")

        val userInfo = UserInfoContextHolder.getUserInfo()
        val authentication = SecurityContextHolder.getContext().authentication

        // 권한 확인 - 댓글 작성자 또는 관리자만 수정 가능
        val isAdmin = authentication.authorities.any { it.authority == "ROLE_ADMIN" }
          if (!isAdmin && commentInfo.user.idx != userInfo.idx) {
            throw IllegalArgumentException("댓글을 수정할 권한이 없습니다.")
        }

        // 기존 댓글 내용 저장 (로그용)
        val oldContent = commentInfo.comment

        // 댓글 내용 수정
        commentInfo.comment = commentUpdateModel.comment

        val updatedComment = commentInfoRepository.save(commentInfo)

        // 활동 로그 이벤트 발행
        applicationEventPublisher.publishEvent(
            CommentUpdateLogEvent(
                userId = userInfo.userId,
                username = userInfo.name,
                targetId = updatedComment.idx.toString(),
                contentIdx = updatedComment.contentInfo.idx,
                oldContent = oldContent,
                newContent = commentUpdateModel.comment
            )
        )
    }
}
