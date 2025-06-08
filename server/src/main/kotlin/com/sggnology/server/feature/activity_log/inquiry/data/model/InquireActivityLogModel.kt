package com.sggnology.server.feature.activity_log.inquiry.data.model

data class InquireActivityLogModel(
    val page: Int,
    val size: Int,
    val userId: String? = null
)