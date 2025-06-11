package com.sggnology.server.feature.comment.update.service

import com.sggnology.server.common.annotation.WithUserInfo
import com.sggnology.server.common.util.UserInfoContextHolder
import com.sggnology.server.db.sql.repository.CommentInfoRepository
import com.sggnology.server.feature.comment.update.data.model.CommentUpdateModel
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CommentUpdateService(
    private val commentInfoRepository: CommentInfoRepository
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

        // 댓글 내용 수정
        commentInfo.comment = commentUpdateModel.comment

        commentInfoRepository.save(commentInfo)
    }
}
