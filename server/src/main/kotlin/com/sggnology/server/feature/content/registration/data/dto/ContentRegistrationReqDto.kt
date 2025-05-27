package com.sggnology.server.feature.content.registration.data.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class ContentRegistrationReqDto(
    val newFileIds: MutableSet<Long> = mutableSetOf(),

    @field:NotBlank(message = "제목은 필수입니다")
    @field:Size(max = 100, message = "제목은 100자 이하여야 합니다")
    val title: String,

    @field:NotBlank(message = "설명은 필수입니다")
    @field:Size(max = 1000, message = "설명은 1000자 이하여야 합니다")
    val description: String,

    @field:NotBlank(message = "위치는 필수입니다")
    @field:Size(max = 200, message = "위치는 200자 이하여야 합니다")
    val location: String,

    val tags: List<String>
)