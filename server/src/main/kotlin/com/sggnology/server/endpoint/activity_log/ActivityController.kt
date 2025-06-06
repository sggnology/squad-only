package com.sggnology.server.endpoint.activity_log

import com.sggnology.server.feature.activity_log.inquiry.data.dto.res.ActivityLogResponseDto
import com.sggnology.server.feature.activity_log.inquiry.data.model.InquireActivityLogModel
import com.sggnology.server.feature.activity_log.inquiry.service.ActvityLogInquiryService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/activity")
@Tag(name = "활동 기록")
class ActivityController(
    private val activityLogInquiryService: ActvityLogInquiryService
) {

    @Operation(
        summary = "최근 활동 기록 조회",
    )
    @GetMapping("")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    fun getRecentActivities(): List<ActivityLogResponseDto> {
        return activityLogInquiryService.execute(
            InquireActivityLogModel(limit = 15)
        )
    }
}