package com.sggnology.server.feature.profile.inquiry.data.dto.res

import java.time.LocalDateTime

data class ProfileInquiryResDto(
    val userId: String,
    val name: String,
    val nickname: String?,
    val createdAt: LocalDateTime,
)