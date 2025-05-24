package com.sggnology.server.feature.admin.account.registiration.data.dto.req

import com.sggnology.server.feature.admin.account.registiration.data.model.AdminRegisterAccountModel

data class AdminAccountRegistrationReqDto(
    val userId: String,
    val name: String
) {
    fun toAdminRegisterAccountModel(): AdminRegisterAccountModel {
        return AdminRegisterAccountModel(
            userId = this.userId,
            password = "1234",
            name = this.name,
        )
    }
}
