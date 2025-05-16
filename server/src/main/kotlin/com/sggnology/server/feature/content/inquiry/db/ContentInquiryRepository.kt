package com.sggnology.server.feature.content.inquiry.db

import com.sggnology.server.feature.content.inquiry.data.dto.ContentInquiryResDto
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

interface ContentInquiryRepository {
    fun inquire(pageable: Pageable): Page<ContentInquiryResDto>
}