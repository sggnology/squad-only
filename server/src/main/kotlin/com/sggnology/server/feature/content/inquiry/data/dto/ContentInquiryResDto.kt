package com.sggnology.server.feature.content.inquiry.data.dto

import java.time.LocalDateTime

data class ContentInquiryResDto(
    val idx: Long,
    val fileIds: MutableSet<Long> = mutableSetOf(),
    val title: String,
    val location: String,
    val description: String,
    val createdAt: LocalDateTime,
    val tags: MutableSet<String> = mutableSetOf()
)