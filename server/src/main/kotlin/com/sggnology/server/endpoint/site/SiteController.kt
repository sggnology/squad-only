package com.sggnology.server.endpoint.site

import com.sggnology.server.feature.site.inquiry.data.dto.res.SiteInquiryResDto
import com.sggnology.server.feature.site.inquiry.service.SiteInquiryService
import io.swagger.v3.oas.annotations.Operation
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/site")
class SiteController(
    private val siteInquiryService: SiteInquiryService
) {

    @Operation(summary = "사이트 정보 조회")
    @GetMapping("")
    fun inquireSite(): SiteInquiryResDto {
        return siteInquiryService.execute()
    }
}