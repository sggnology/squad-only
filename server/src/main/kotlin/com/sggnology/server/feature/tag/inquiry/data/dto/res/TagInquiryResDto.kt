package com.sggnology.server.feature.tag.inquiry.data.dto.res

import com.sggnology.server.db.sql.entity.TagInfo

data class TagInquiryResDto(
    val name: String
) {
    companion object {
        fun fromTagInfo(tagInfo: TagInfo): TagInquiryResDto {
            return TagInquiryResDto(name = tagInfo.name)
        }
    }
}
