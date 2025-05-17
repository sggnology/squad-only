package com.sggnology.server.feature.content.registration.data.dto

import jakarta.validation.constraints.NotBlank

data class ContentRegistrationReqDto(
    val newFileIds: MutableSet<Long> = mutableSetOf(),
    @field:NotBlank(message = "제목은 필수입니다.")
    val title: String,
    @field:NotBlank(message = "설명은 필수입니다.")
    val description: String,
    val location: String,
    val tags: List<String>
)