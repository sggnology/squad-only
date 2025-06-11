package com.sggnology.server.feature.comment.inquiry.data.model

data class CommentInquireModel(
    val contentIdx: Long,
    val page: Int = 0,
    val size: Int = 20
)
