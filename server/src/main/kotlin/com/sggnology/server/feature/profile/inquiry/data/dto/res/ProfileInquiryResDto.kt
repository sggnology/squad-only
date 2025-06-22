package com.sggnology.server.feature.profile.inquiry.data.dto.res

import java.time.Instant

data class ProfileInquiryResDto(
    val userId: String,
    val name: String,
    val nickname: String?,
    val createdAt: Instant,
)