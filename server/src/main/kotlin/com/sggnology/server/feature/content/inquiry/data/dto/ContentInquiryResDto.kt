package com.sggnology.server.feature.content.inquiry.data.dto

import com.sggnology.server.db.sql.entity.ContentInfo
import java.time.LocalDateTime

data class ContentInquiryResDto(
    val idx: Long,
    val fileIds: MutableSet<Long> = mutableSetOf(),
    val title: String,
    val location: String,
    val description: String,
    val createdAt: LocalDateTime,
    val tags: MutableSet<String> = mutableSetOf(),
    val registeredUserId: String? = null
){
    companion object{
        fun fromContentInfo(contentInfo: ContentInfo): ContentInquiryResDto {
            return ContentInquiryResDto(
                idx = contentInfo.idx,
                fileIds = contentInfo.fileInfos.map { it.idx }.toMutableSet(),
                title = contentInfo.title,
                location = contentInfo.location,
                description = contentInfo.description,
                createdAt = contentInfo.createdAt,
                tags = contentInfo.contentTags.map { it.tag.name }.toMutableSet(),
                registeredUserId = contentInfo.registeredUser?.userId
            )
        }
    }
}