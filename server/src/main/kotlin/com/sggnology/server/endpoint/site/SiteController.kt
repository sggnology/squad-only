package com.sggnology.server.endpoint.site

import com.sggnology.server.feature.site.inquiry.data.dto.res.SiteInquiryResDto
import com.sggnology.server.feature.site.inquiry.service.SiteInquiryService
import com.sggnology.server.feature.site.modification.data.dto.req.SiteModificationReqDto
import com.sggnology.server.feature.site.modification.data.dto.res.SiteModificationResDto
import com.sggnology.server.feature.site.modification.data.model.SiteModifyModel
import com.sggnology.server.feature.site.modification.service.SiteModificationService
import io.swagger.v3.oas.annotations.Operation
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/site")
class SiteController(
    private val siteInquiryService: SiteInquiryService,
    private val siteModificationService: SiteModificationService
) {

    @Operation(summary = "사이트 정보 조회")
    @GetMapping("")
    fun inquireSite(): SiteInquiryResDto {
        return siteInquiryService.execute()
    }

    @Operation(summary = "사이트 정보 수정")
    @PutMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    fun modifySite(
        @RequestBody siteModificationReqDto: SiteModificationReqDto
    ): SiteModificationResDto {
        return siteModificationService.execute(
            SiteModifyModel.fromSiteModificationReqDto(
                siteModificationReqDto
            )
        )
    }
}