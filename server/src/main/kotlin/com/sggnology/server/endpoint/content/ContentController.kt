package com.sggnology.server.endpoint.content

import com.sggnology.server.feature.content.inquiry.data.dto.ContentInquiryResDto
import com.sggnology.server.feature.content.inquiry.service.ContentInquiryService
import com.sggnology.server.feature.content.registration.data.dto.ContentRegistrationReqDto
import com.sggnology.server.feature.content.registration.service.ContentRegistrationService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.data.domain.Page
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("api/v1/content")
@Tag(name = "Content Management", description = "Content management APIs")
class ContentController(
    private val contentInquiryService: ContentInquiryService,
    private val contentRegistrationService: ContentRegistrationService
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
        return contentInquiryService.execute(page, size)
    }

    @Operation(
        summary = "Register content"
    )
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Successfully registered content"),
        ApiResponse(responseCode = "400", description = "Bad request"),
    ])
    @PostMapping("")
    fun register(
        @Valid @RequestBody contentRegistrationReqDto: ContentRegistrationReqDto
    ) {
        contentRegistrationService.execute(contentRegistrationReqDto)
    }
}