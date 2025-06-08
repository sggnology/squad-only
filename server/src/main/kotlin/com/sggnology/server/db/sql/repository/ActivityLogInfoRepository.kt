package com.sggnology.server.db.sql.repository

import com.sggnology.server.db.sql.entity.ActivityLogInfo
import com.sggnology.server.feature.activity_log.inquiry.db.ActivityLogInquiryRepository
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface ActivityLogInfoRepository
    : JpaRepository<ActivityLogInfo, Long>, ActivityLogInquiryRepository {

    @Query("""
        select ali from ActivityLogInfo ali
        order by ali.createdAt desc
        limit :limit
    """)
    fun selectTopNByOrderByCreatedAtDesc(limit: Int): List<ActivityLogInfo>
}