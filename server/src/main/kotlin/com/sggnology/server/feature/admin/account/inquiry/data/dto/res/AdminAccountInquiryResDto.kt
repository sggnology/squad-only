package com.sggnology.server.feature.admin.account.inquiry.data.dto.res

import com.sggnology.server.db.sql.entity.UserInfo
import java.time.LocalDateTime

data class AdminAccountInquiryResDto(
    val userId: String,
    val name: String,
    val isEnabled: Boolean,
    val isDeleted: Boolean,
    val roles: List<String>,
    val createdAt: LocalDateTime,
    val lastLoginAt: LocalDateTime?
) {
    companion object {
        fun fromUserInfo(userInfo: UserInfo): AdminAccountInquiryResDto {
            return AdminAccountInquiryResDto(
                userId = userInfo.userId,
                name = userInfo.name,
                isEnabled = userInfo.isEnabled,
                isDeleted = userInfo.isDeleted,
                roles = userInfo.getRoleList(),
                createdAt = userInfo.createdAt,
                lastLoginAt = userInfo.lastLoginAt
            )
        }
    }
}