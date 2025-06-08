package com.sggnology.server.feature.tag.inquiry.db

import com.sggnology.server.db.sql.entity.TagInfo
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

interface TagInquiryRepository {
    fun inquire(
        pageable: Pageable,
    ): Page<TagInfo>
}