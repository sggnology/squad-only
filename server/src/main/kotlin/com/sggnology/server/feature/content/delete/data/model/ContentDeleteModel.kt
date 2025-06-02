package com.sggnology.server.feature.content.delete.data.model

import com.sggnology.server.feature.content.delete.data.dto.req.ContentDeleteReqDto

data class ContentDeleteModel(
    val idxs: List<Long>
) {
    companion object {
        fun fromContentDeleteReqDto(req: ContentDeleteReqDto): ContentDeleteModel {
            return ContentDeleteModel(
                idxs = req.idxs
            )
        }
    }
}
