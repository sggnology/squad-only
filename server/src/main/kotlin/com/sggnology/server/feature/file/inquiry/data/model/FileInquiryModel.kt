package com.sggnology.server.feature.file.inquiry.data.model

import com.sggnology.server.db.sql.entity.FileInfo
import org.springframework.core.io.Resource

data class FileInquiryModel(
    val resource: Resource,
    val fileInfo: FileInfo
)
