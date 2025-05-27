package com.sggnology.server.feature.content.update.data.model

data class ContentUpdateModel(
    val idx: Long,
    val title: String,
    val description: String,
    val location: String,
    val tags: List<String>,
    val newFileIds: MutableSet<Long> = mutableSetOf()
)
