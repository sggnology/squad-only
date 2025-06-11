package com.sggnology.server.feature.comment.inquiry.db

import com.sggnology.server.db.sql.entity.CommentInfo
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

interface CommentInquiryRepository {
    fun inquire(
        pageable: Pageable,
        contentIdx: Long
    ): Page<CommentInfo>
}
