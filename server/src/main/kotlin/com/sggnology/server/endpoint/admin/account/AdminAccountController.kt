package com.sggnology.server.endpoint.admin.account

import com.sggnology.server.feature.admin.account.inquiry.data.dto.res.AdminAccountInquiryResDto
import com.sggnology.server.feature.admin.account.inquiry.data.model.AdminInquireAccountModel
import com.sggnology.server.feature.admin.account.inquiry.service.AdminAccountInquiryService
import com.sggnology.server.feature.admin.account.modification.data.dto.res.AdminAccountToggleIsEnabledStatusResDto
import com.sggnology.server.feature.admin.account.modification.data.model.AdminDeleteAccountModel
import com.sggnology.server.feature.admin.account.modification.data.model.AdminToggleAccountIsEnabledStatusModel
import com.sggnology.server.feature.admin.account.modification.service.AdminAccountModificationService
import com.sggnology.server.feature.admin.account.registiration.data.dto.req.AdminAccountRegistrationReqDto
import com.sggnology.server.feature.admin.account.registiration.service.AdminAccountRegistrationService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.data.web.PagedModel
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/admin/account")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "[관리자] 계정 관리")
class AdminAccountController(
    private val adminAccountInquiryService: AdminAccountInquiryService,
    private val adminAccountRegistrationService: AdminAccountRegistrationService,
    private val adminAccountModificationService: AdminAccountModificationService
) {

    @Operation(
        summary = "사용자 계정 조회"
    )
    @GetMapping("")
    fun inquireAccounts(
        @RequestParam page: Int,
        @RequestParam size: Int
    ): PagedModel<AdminAccountInquiryResDto> {
        val result = adminAccountInquiryService.execute(
            AdminInquireAccountModel(
                page = page,
                size = size
            )
        )
        return result
    }

    @Operation(summary = "사용자 계정 등록")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = ""),
        ]
    )
    @PostMapping("")
    fun registerAccount(
        @Valid @RequestBody adminAccountRegistrationReqDto: AdminAccountRegistrationReqDto
    ) {
        adminAccountRegistrationService.execute(
            adminAccountRegistrationReqDto.toAdminRegisterAccountModel()
        )
    }

    @Operation(summary = "사용자 계정 삭제")
    @DeleteMapping("/{userId}")
    fun deleteAccount(
        @PathVariable userId: String
    ) {
        adminAccountModificationService.execute(
            AdminDeleteAccountModel(
                userId = userId
            )
        )
    }

    @Operation(summary = "사용자 계정 활성화 상태 토글")
    @PatchMapping("/toggle/{userId}")
    fun toggleAccountIsEnabledStatus(
        @PathVariable userId: String
    ): AdminAccountToggleIsEnabledStatusResDto {
        return adminAccountModificationService.execute(
            AdminToggleAccountIsEnabledStatusModel(
                userId = userId
            )
        )
    }

}