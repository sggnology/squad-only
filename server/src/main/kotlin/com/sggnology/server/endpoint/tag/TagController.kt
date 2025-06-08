package com.sggnology.server.endpoint.tag

import com.sggnology.server.feature.tag.inquiry.data.dto.res.TagInquiryResDto
import com.sggnology.server.feature.tag.inquiry.data.model.TagInquireModel
import com.sggnology.server.feature.tag.inquiry.service.TagInquiryService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.data.web.PagedModel
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/tag")
@Tag(name = "Tag", description = "태그 관련 API")
class TagController(
    private val tagInquiryService: TagInquiryService
) {

    @Operation(summary = "태그 조회")
    @GetMapping("")
    fun inquire(
        @RequestParam page: Int,
        @RequestParam size: Int,
        @RequestParam search: String? = null
    ): PagedModel<TagInquiryResDto> {
       return tagInquiryService.execute(
           TagInquireModel(
               page = page,
               size = size,
               search = search
           )
        )
    }
}