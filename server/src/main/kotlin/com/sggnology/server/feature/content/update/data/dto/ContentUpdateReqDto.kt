package com.sggnology.server.feature.content.update.data.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class ContentUpdateReqDto(
    @field:NotBlank(message = "제목은 필수입니다")
    @field:Size(max = 100, message = "제목은 100자 이하여야 합니다")
    val title: String,

    val description: String,

    @field:NotBlank(message = "위치는 필수입니다")
    @field:Size(max = 200, message = "위치는 200자 이하여야 합니다")
    val location: String,

    val tags: List<String> = emptyList(),
    
    val newFileIds: MutableSet<Long> = mutableSetOf()
)
