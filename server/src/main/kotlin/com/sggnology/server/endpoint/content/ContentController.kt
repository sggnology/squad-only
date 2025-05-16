package com.sggnology.server.endpoint.content

import com.sggnology.server.feature.content.inquiry.data.dto.ContentInquiryResDto
import com.sggnology.server.feature.content.inquiry.service.ContentInquiryService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.data.domain.Page
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("api/v1/content")
@Tag(name = "Content Management", description = "Content management APIs")
class ContentController(
    private val contentInquiryService: ContentInquiryService
) {

    @Operation(
        summary = "Get paged contents",
    )
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Successfully retrieved paged contents"),
    ])
    @GetMapping("")
    fun inquire(
        @RequestParam page: Int,
        @RequestParam size: Int
    ): Page<ContentInquiryResDto> {
        return contentInquiryService.inquireContents(page, size)
    }
}