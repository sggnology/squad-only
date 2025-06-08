package com.sggnology.server.feature.activity_log.inquiry.db

import com.sggnology.server.db.sql.entity.ActivityLogInfo
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

interface ActivityLogInquiryRepository {
    fun inquire(
        pageable: Pageable,
        userId: String? = null,
    ): Page<ActivityLogInfo>
}