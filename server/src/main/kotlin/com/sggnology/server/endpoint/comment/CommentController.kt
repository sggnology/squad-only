package com.sggnology.server.endpoint.comment

import com.sggnology.server.feature.comment.delete.data.dto.req.CommentDeleteReqDto
import com.sggnology.server.feature.comment.delete.service.CommentDeleteService
import com.sggnology.server.feature.comment.inquiry.data.dto.res.CommentInquiryResDto
import com.sggnology.server.feature.comment.inquiry.data.model.CommentInquireModel
import com.sggnology.server.feature.comment.inquiry.service.CommentInquiryService
import com.sggnology.server.feature.comment.registration.data.dto.req.CommentRegistrationReqDto
import com.sggnology.server.feature.comment.registration.service.CommentRegistrationService
import com.sggnology.server.feature.comment.update.data.dto.req.CommentUpdateReqDto
import com.sggnology.server.feature.comment.update.service.CommentUpdateService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.data.web.PagedModel
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/comment")
@Tag(name = "Comment Management", description = "댓글 관리 API")
class CommentController(
    private val commentInquiryService: CommentInquiryService,
    private val commentRegistrationService: CommentRegistrationService,
    private val commentUpdateService: CommentUpdateService,
    private val commentDeleteService: CommentDeleteService
) {

    @Operation(summary = "댓글 조회", description = "특정 컨텐츠의 댓글 목록을 조회합니다.")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "댓글 조회 성공"),
        ApiResponse(responseCode = "400", description = "잘못된 요청")
    ])
    @GetMapping("/{contentIdx}")
    fun inquireComments(
        @PathVariable contentIdx: Long,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int
    ): PagedModel<CommentInquiryResDto> {
        return commentInquiryService.execute(
            CommentInquireModel(
                contentIdx = contentIdx,
                page = page,
                size = size
            )
        )
    }

    @Operation(summary = "댓글 등록", description = "새로운 댓글을 등록합니다.")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "댓글 등록 성공"),
        ApiResponse(responseCode = "400", description = "잘못된 요청"),
        ApiResponse(responseCode = "401", description = "인증 필요")
    ])
    @PostMapping("/{contentIdx}")
    fun registerComment(
        @PathVariable contentIdx: Long,
        @Valid @RequestBody commentRegistrationReqDto: CommentRegistrationReqDto
    ) {
        commentRegistrationService.execute(
            commentRegistrationReqDto.toCommentRegisterModel(contentIdx)
        )
    }

    @Operation(summary = "댓글 수정", description = "기존 댓글을 수정합니다.")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "댓글 수정 성공"),
        ApiResponse(responseCode = "400", description = "잘못된 요청"),
        ApiResponse(responseCode = "401", description = "인증 필요"),
        ApiResponse(responseCode = "403", description = "권한 없음")
    ])
    @PutMapping("/{commentIdx}")
    fun updateComment(
        @PathVariable commentIdx: Long,
        @Valid @RequestBody commentUpdateReqDto: CommentUpdateReqDto
    ) {
        commentUpdateService.execute(
            commentUpdateReqDto.toCommentUpdateModel(commentIdx)
        )
    }

    @Operation(summary = "댓글 삭제", description = "댓글을 삭제합니다.")
    @ApiResponses(value = [
        ApiResponse(responseCode = "200", description = "댓글 삭제 성공"),
        ApiResponse(responseCode = "400", description = "잘못된 요청"),
        ApiResponse(responseCode = "401", description = "인증 필요"),
        ApiResponse(responseCode = "403", description = "권한 없음")
    ])
    @DeleteMapping("/{commentIdx}")
    fun deleteComment(
        @PathVariable commentIdx: Long
    ) {
        commentDeleteService.execute(
            CommentDeleteReqDto(commentIdx).toCommentDeleteModel()
        )
    }
}
