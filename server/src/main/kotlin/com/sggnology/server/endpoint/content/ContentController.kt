package com.sggnology.server.endpoint.content

import com.sggnology.server.feature.content.delete.data.dto.req.ContentDeleteReqDto
import com.sggnology.server.feature.content.delete.data.model.ContentDeleteModel
import com.sggnology.server.feature.content.delete.service.ContentDeleteService
import com.sggnology.server.feature.content.inquiry.data.dto.ContentInquiryResDto
import com.sggnology.server.feature.content.inquiry.data.dto.ContentsInquiryResDto
import com.sggnology.server.feature.content.inquiry.data.model.ContentInquiryModel
import com.sggnology.server.feature.content.inquiry.data.model.ContentsInquiryModel
import com.sggnology.server.feature.content.inquiry.service.ContentInquiryService
import com.sggnology.server.feature.content.registration.data.dto.ContentRegistrationReqDto
import com.sggnology.server.feature.content.registration.service.ContentRegistrationService
import com.sggnology.server.feature.content.update.data.dto.ContentUpdateReqDto
import com.sggnology.server.feature.content.update.data.model.ContentUpdateModel
import com.sggnology.server.feature.content.update.service.ContentUpdateService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.data.web.PagedModel
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("api/v1/content")
@Tag(name = "Content Management", description = "Content management APIs")
class ContentController(
    private val contentInquiryService: ContentInquiryService,
    private val contentRegistrationService: ContentRegistrationService,
    private val contentUpdateService: ContentUpdateService,
    private val contentDeleteService: ContentDeleteService
){

    @Operation(
        summary = "Get content",
    )
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Successfully retrieved content"),
    ])
    @GetMapping("/{idx}")
    fun inquireContent(
        @PathVariable("idx") idx: Long,
    ): ContentInquiryResDto {
        return contentInquiryService.execute(
            ContentInquiryModel(idx = idx)
        )
    }

    @Operation(
        summary = "Get paged contents",
    )
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Successfully retrieved paged contents"),
    ])
    @GetMapping("")
    fun inquireContents(
        @RequestParam page: Int,
        @RequestParam size: Int
    ): PagedModel<ContentsInquiryResDto> {
        return contentInquiryService.execute(
            ContentsInquiryModel(page = page, size = size)
        )
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

    @Operation(
        summary = "Update content"
    )
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Successfully updated content"),
        ApiResponse(responseCode = "400", description = "Bad request"),
        ApiResponse(responseCode = "403", description = "Forbidden - No permission to update this content"),
        ApiResponse(responseCode = "404", description = "Content not found"),
    ])    @PutMapping("/{idx}")
    fun update(
        @PathVariable("idx") idx: Long,
        @Valid @RequestBody contentUpdateReqDto: ContentUpdateReqDto
    ) {
        contentUpdateService.execute(
            ContentUpdateModel(
                idx = idx,
                title = contentUpdateReqDto.title,
                description = contentUpdateReqDto.description,
                location = contentUpdateReqDto.location,
                tags = contentUpdateReqDto.tags,
                newFileIds = contentUpdateReqDto.newFileIds
            )
        )
    }

    @Operation(
        summary = "Delete content"
    )
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Successfully delete content"),
        ApiResponse(responseCode = "400", description = "Bad request"),
    ])
    @DeleteMapping("")
    fun delete(
        @RequestBody contentDeleteReqDto: ContentDeleteReqDto
    ) {
        contentDeleteService.execute(
            ContentDeleteModel.fromContentDeleteReqDto(
                contentDeleteReqDto
            )
        )
    }
}