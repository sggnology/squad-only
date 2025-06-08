package com.sggnology.server.db.sql.repository

import com.sggnology.server.db.sql.entity.TagInfo
import com.sggnology.server.feature.tag.inquiry.db.TagInquiryRepository
import org.springframework.data.jpa.repository.JpaRepository

interface TagInfoRepository
    : JpaRepository<TagInfo, Long>, TagInquiryRepository {
    fun findByNameIn(names: List<String>): List<TagInfo>
}
