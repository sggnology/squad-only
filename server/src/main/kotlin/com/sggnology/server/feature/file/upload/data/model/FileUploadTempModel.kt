package com.sggnology.server.feature.file.upload.data.model

import org.springframework.web.multipart.MultipartFile

data class FileUploadTempModel (
    val files: List<MultipartFile>
)