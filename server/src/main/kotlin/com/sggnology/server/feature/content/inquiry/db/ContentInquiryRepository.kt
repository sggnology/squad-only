package com.sggnology.server.feature.content.inquiry.db

import com.sggnology.server.db.sql.entity.ContentInfo
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

interface ContentInquiryRepository {
    fun inquire(
        pageable: Pageable,
        search: String?,
        tags: List<String>,
        userId: String?
    ): Page<ContentInfo>
}