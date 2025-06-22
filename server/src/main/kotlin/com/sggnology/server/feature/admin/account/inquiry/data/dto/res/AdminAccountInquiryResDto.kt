package com.sggnology.server.feature.admin.account.inquiry.data.dto.res

import com.sggnology.server.db.sql.entity.UserInfo
import java.time.Instant

data class AdminAccountInquiryResDto(
    val userId: String,
    val name: String,
    val isEnabled: Boolean,
    val isDeleted: Boolean,
    val roles: List<String>,
    val createdAt: Instant,
    val lastLoginAt: Instant?
) {    companion object {
        fun fromUserInfo(userInfo: UserInfo): AdminAccountInquiryResDto {
            return AdminAccountInquiryResDto(
                userId = userInfo.userId,
                name = userInfo.name,
                isEnabled = userInfo.isEnabled,
                isDeleted = userInfo.isDeleted,
                roles = userInfo.getRoleList(),
                createdAt = userInfo.createdAt ?: throw IllegalStateException("createdAt should not be null for persisted entity"),
                lastLoginAt = userInfo.lastLoginAt
            )
        }
    }
}