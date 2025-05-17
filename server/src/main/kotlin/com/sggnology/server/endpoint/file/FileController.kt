package com.sggnology.server.endpoint.file

import com.sggnology.server.feature.file.download.service.FileDownloadService
import com.sggnology.server.feature.file.inquiry.service.FileInquiryService
import com.sggnology.server.feature.file.upload.data.model.FileUploadTempModel
import com.sggnology.server.feature.file.upload.service.FileUploadService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.core.io.Resource
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/v1/file")
@Tag(name = "File Management", description = "File management APIs")
class FileController(
    private val fileDownloadService: FileDownloadService,
    private val fileInquiryService: FileInquiryService,
    private val fileUploadService: FileUploadService
) {

    @Operation(summary = "Inquire a file by IDX")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "response a file with ContentType"),
    ])
    @GetMapping("/{idx}")
    fun inquire(@PathVariable idx: Long): ResponseEntity<Resource> {

        val fileInquiryModel = fileInquiryService.execute(idx)

        return ResponseEntity.ok()
            .header(
                HttpHeaders.CONTENT_TYPE,
                fileInquiryModel.fileInfo.contentType
            )
            .body(fileInquiryModel.resource)
    }

    @Operation(summary = "Download a file by IDX")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "download a file with disposition; attachment"),
    ])
    @GetMapping("/download/{idx}")
    fun download(@PathVariable idx: Long): ResponseEntity<Resource> {

        val fileDownloadModel = fileDownloadService.execute(idx)

        return ResponseEntity.ok()
            .header(
                HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"${fileDownloadModel.fileInfo.originalName}\""
            )
            .body(fileDownloadModel.resource)
    }

    @Operation(
        summary = "Create a new file",
    )
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "Successfully retrieved paged contents"),
    ])
    @PostMapping("")
    fun upload(
        @RequestParam("files") files: List<MultipartFile>
    ): List<Long> {
        return fileUploadService.execute(
            FileUploadTempModel(
                files = files
            )
        )
    }
}