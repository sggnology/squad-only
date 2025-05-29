package com.sggnology.server.feature.site.modification.data.model

import com.sggnology.server.feature.site.modification.data.dto.req.SiteModificationReqDto

data class SiteModifyModel(
    val name: String
) {
    companion object {
        fun fromSiteModificationReqDto(
            siteModificationReqDto: SiteModificationReqDto
        ): SiteModifyModel {
            return SiteModifyModel(
                name = siteModificationReqDto.name
            )
        }
    }
}
