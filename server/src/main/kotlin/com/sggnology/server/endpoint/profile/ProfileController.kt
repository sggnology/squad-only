package com.sggnology.server.endpoint.profile

import com.sggnology.server.feature.profile.inquiry.data.dto.res.ProfileInquiryResDto
import com.sggnology.server.feature.profile.inquiry.service.ProfileInquiryService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/profile")
@Tag(name = "Profile")
class ProfileController(
    private val profileInquiryService: ProfileInquiryService,
) {

    @Operation(summary = "사용자 프로필 조회")
    @GetMapping("")
    fun inquireProfile(): ProfileInquiryResDto {
        return profileInquiryService.execute()
    }
}