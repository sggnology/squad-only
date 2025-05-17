package com.sggnology.server.feature.file.download.data.model

import com.sggnology.server.db.sql.entity.FileInfo
import org.springframework.core.io.Resource

data class FileDownloadModel (
    val resource: Resource,
    val fileInfo: FileInfo
)