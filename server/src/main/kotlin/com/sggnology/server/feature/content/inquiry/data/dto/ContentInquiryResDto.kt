package com.sggnology.server.feature.content.inquiry.data.dto

import com.querydsl.core.annotations.QueryProjection
import java.time.LocalDateTime

data class ContentInquiryResDto @QueryProjection constructor(
    val idx: Long,
    val imageUrl: String,
    val title: String,
    val location: String,
    val description: String,
    val createdAt: LocalDateTime
) {
    // Querydsl 에서 Scalar Value 만 입력 가능하다.
    val tags: MutableList<String> = mutableListOf()
}
