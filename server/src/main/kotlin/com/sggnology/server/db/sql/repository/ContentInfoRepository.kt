package com.sggnology.server.db.sql.repository

import com.sggnology.server.db.sql.entity.ContentInfo
import com.sggnology.server.feature.content.inquiry.db.ContentInquiryRepository
import org.springframework.data.jpa.repository.JpaRepository


interface ContentInfoRepository
    : JpaRepository<ContentInfo, Long>, ContentInquiryRepository

