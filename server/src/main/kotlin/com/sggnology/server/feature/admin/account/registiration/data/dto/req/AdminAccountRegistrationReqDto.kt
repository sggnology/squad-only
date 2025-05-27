package com.sggnology.server.feature.admin.account.registiration.data.dto.req

import com.sggnology.server.feature.admin.account.registiration.data.model.AdminRegisterAccountModel
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class AdminAccountRegistrationReqDto(
    @field:NotBlank(message = "사용자 ID는 필수입니다")
    @field:Size(min = 4, max = 20, message = "사용자 ID는 4자 이상 20자 이하여야 합니다")
    val userId: String,

    @field:NotBlank(message = "이름은 필수입니다")
    @field:Size(max = 50, message = "이름은 50자 이하여야 합니다")
    val name: String,
) {
    fun toAdminRegisterAccountModel(): AdminRegisterAccountModel {
        return AdminRegisterAccountModel(
            userId = this.userId,
            password = "1234",
            name = this.name,
        )
    }
}
