package com.sggnology.server.feature.content.inquiry.data.model

data class ContentsInquiryModel(
    val page: Int,
    val size: Int,
    val search: String?,
    val tags: List<String>,
    val userId: String?
)
