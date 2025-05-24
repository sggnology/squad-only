package com.sggnology.server.feature.admin.account.registiration.data.model

import com.sggnology.server.db.sql.entity.UserInfo

data class AdminRegisterAccountModel(
    val userId: String,
    val password: String,
    val name: String,
) {
    fun toUserInfo(): UserInfo {
        return UserInfo(
            userId = userId,
            userPw = password,
            name = name,
            nickname = null
        )
    }
}