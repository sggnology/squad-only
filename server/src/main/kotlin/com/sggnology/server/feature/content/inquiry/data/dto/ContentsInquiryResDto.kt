package com.sggnology.server.feature.content.inquiry.data.dto

import com.sggnology.server.db.sql.entity.ContentInfo
import java.time.Instant

data class ContentsInquiryResDto(
    val idx: Long,
    val fileIds: MutableSet<Long> = mutableSetOf(),
    val title: String,
    val location: String,
    val createdAt: Instant,
    val tags: MutableSet<String> = mutableSetOf(),
    val registeredUsername: String?,
    val commentCount: Long = 0
) {
    companion object {
        fun fromContentInfo(contentInfo: ContentInfo): ContentsInquiryResDto {
            return ContentsInquiryResDto(
                idx = contentInfo.idx,
                fileIds = contentInfo.fileInfos.map { it.idx }.toMutableSet(), title = contentInfo.title,
                location = contentInfo.location,
                createdAt = contentInfo.createdAt
                    ?: throw IllegalStateException("createdAt should not be null for persisted entity"),
                tags = contentInfo.contentTags.map { it.tag.name }.toMutableSet(),
                registeredUsername = if (!contentInfo.registeredUser?.nickname.isNullOrEmpty()) {
                    contentInfo.registeredUser?.nickname
                } else if (!contentInfo.registeredUser?.name.isNullOrEmpty()) {
                    contentInfo.registeredUser?.name
                } else {
                    contentInfo.registeredUser?.userId
                },
                commentCount = contentInfo.comments.count { !it.isDeleted }.toLong()
            )
        }
    }
}