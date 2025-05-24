package com.sggnology.server.endpoint.admin.account

import com.sggnology.server.feature.admin.account.registiration.data.dto.req.AdminAccountRegistrationReqDto
import com.sggnology.server.feature.admin.account.registiration.service.AdminAccountRegistrationService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/admin/account")
@Tag(name = "[관리자] 계정 관리")
class AdminAccountController(
    private val adminAccountRegistrationService: AdminAccountRegistrationService
) {

    @Operation(summary = "사용자 계정 등록")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = ""),
    ])
    @PostMapping("/user")
    fun registerAccount(
        @RequestBody adminAccountRegistrationReqDto: AdminAccountRegistrationReqDto
    ) {
        adminAccountRegistrationService.execute(
            adminAccountRegistrationReqDto.toAdminRegisterAccountModel()
        )
    }

}