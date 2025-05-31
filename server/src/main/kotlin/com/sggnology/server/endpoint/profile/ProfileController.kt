package com.sggnology.server.endpoint.profile

import com.sggnology.server.feature.profile.inquiry.data.dto.res.ProfileInquiryResDto
import com.sggnology.server.feature.profile.inquiry.service.ProfileInquiryService
import com.sggnology.server.feature.profile.modification.data.dto.req.ProfileModificationReqDto
import com.sggnology.server.feature.profile.modification.data.dto.req.ProfilePasswordModificationReqDto
import com.sggnology.server.feature.profile.modification.data.dto.res.ProfileModificationResDto
import com.sggnology.server.feature.profile.modification.data.model.ProfileModifyModel
import com.sggnology.server.feature.profile.modification.data.model.ProfileModifyPasswordModel
import com.sggnology.server.feature.profile.modification.service.ProfileModificationService
import com.sggnology.server.feature.profile.modification.service.ProfilePasswordModificationService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/profile")
@Tag(name = "Profile")
class ProfileController(
    private val profileInquiryService: ProfileInquiryService,
    private val profileModificationService: ProfileModificationService,
    private val profilePasswordModificationService: ProfilePasswordModificationService,
) {

    @Operation(summary = "사용자 프로필 조회")
    @GetMapping("")
    fun inquireProfile(): ProfileInquiryResDto {
        return profileInquiryService.execute()
    }

    @Operation(summary = "사용자 프로필 수정")
    @PutMapping("")
    fun modifyProfile(
        @Valid @RequestBody profileModificationReqDto: ProfileModificationReqDto,
    ): ProfileModificationResDto {
        return profileModificationService.execute(
            ProfileModifyModel.fromProfileModificationReqDto(
                profileModificationReqDto
            )
        )
    }

    @Operation(summary = "사용자 프로필 수정 (비밀번호 변경)")
    @PutMapping("/password")
    fun modifyPassword(
        @Valid @RequestBody profilePasswordModificationReqDto: ProfilePasswordModificationReqDto,
    ) {
        return profilePasswordModificationService.execute(
            ProfileModifyPasswordModel.fromProfilePasswordModificationReqDto(
                profilePasswordModificationReqDto
            )
        )
    }
}