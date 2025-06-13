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
    val registeredUserId: String? = null,
    val registeredUsername: String?,
    val commentCount: Long = 0
){    companion object{
        fun fromContentInfo(contentInfo: ContentInfo, commentCount: Long = 0): ContentInquiryResDto {
            return ContentInquiryResDto(
                idx = contentInfo.idx,
                fileIds = contentInfo.fileInfos.map { it.idx }.toMutableSet(),
                title = contentInfo.title,
                location = contentInfo.location,
                description = contentInfo.description,
                createdAt = contentInfo.createdAt,
                tags = contentInfo.contentTags.map { it.tag.name }.toMutableSet(),
                registeredUserId = contentInfo.registeredUser?.userId,
                registeredUsername =  if(!contentInfo.registeredUser?.nickname.isNullOrEmpty()) {
                    contentInfo.registeredUser?.nickname
                } else if(!contentInfo.registeredUser?.name.isNullOrEmpty()) {
                    contentInfo.registeredUser?.name
                }
                else {
                    contentInfo.registeredUser?.userId
                },
                commentCount = commentCount
            )
        }
    }
}