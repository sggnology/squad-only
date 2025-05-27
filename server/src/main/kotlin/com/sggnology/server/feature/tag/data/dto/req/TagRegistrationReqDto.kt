package com.sggnology.server.feature.tag.data.dto.req

import com.sggnology.server.feature.tag.data.model.TagRegisterModel

data class TagRegistrationReqDto(
    val tagNames: List<String>
) {
    fun toTagRegisterModel(): TagRegisterModel {
        return TagRegisterModel(
            tagNames = tagNames
        )
    }
}