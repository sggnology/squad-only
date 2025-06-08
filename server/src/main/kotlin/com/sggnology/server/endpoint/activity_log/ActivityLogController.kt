package com.sggnology.server.endpoint.activity_log

import com.sggnology.server.feature.activity_log.inquiry.data.dto.res.ActivityLogResponseDto
import com.sggnology.server.feature.activity_log.inquiry.data.model.InquireActivityLogModel
import com.sggnology.server.feature.activity_log.inquiry.service.ActivityLogInquiryService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.data.web.PagedModel
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/activity-log")
@Tag(name = "활동 기록")
class ActivityLogController(
    private val activityLogInquiryService: ActivityLogInquiryService
) {

    @Operation(
        summary = "최근 활동 기록 조회",
    )
    @GetMapping("")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    fun getRecentActivities(
        @RequestParam page: Int = 0,
        @RequestParam size: Int = 15,
        @RequestParam userId: String? = null
    ): PagedModel<ActivityLogResponseDto> {
        return activityLogInquiryService.execute(
            InquireActivityLogModel(
                page = page,
                size = size,
                userId = userId
            )
        )
    }
}