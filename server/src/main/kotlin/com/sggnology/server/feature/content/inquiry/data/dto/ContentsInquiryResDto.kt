package com.sggnology.server.feature.content.inquiry.data.dto

import com.sggnology.server.db.sql.entity.ContentInfo
import java.time.LocalDateTime

data class ContentsInquiryResDto(
    val idx: Long,
    val fileIds: MutableSet<Long> = mutableSetOf(),
    val title: String,
    val location: String,
    val createdAt: LocalDateTime,
    val tags: MutableSet<String> = mutableSetOf()
){
    companion object{
        fun fromContentInfo(contentInfo: ContentInfo): ContentsInquiryResDto {
            return ContentsInquiryResDto(
                idx = contentInfo.idx,
                fileIds = contentInfo.fileInfos.map { it.idx }.toMutableSet(),
                title = contentInfo.title,
                location = contentInfo.location,
                createdAt = contentInfo.createdAt,
                tags = contentInfo.contentTags.map { it.tag.name }.toMutableSet()
            )
        }
    }
}