package com.sggnology.server.feature.tag.domain.data.model

import com.sggnology.server.db.sql.entity.TagInfo

data class TagRegistrationModel(
    val prevTagInfos: List<TagInfo>,
    val newTagInfos: List<TagInfo>,
    val combinedTagInfos: List<TagInfo>
)
