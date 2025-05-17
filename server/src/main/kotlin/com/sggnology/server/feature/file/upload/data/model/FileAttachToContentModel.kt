package com.sggnology.server.feature.file.upload.data.model

import com.sggnology.server.db.sql.entity.ContentInfo
import com.sggnology.server.db.sql.entity.FileInfo

data class FileAttachToContentModel(
    val fileInfos: List<FileInfo>,
    val contentInfo: ContentInfo
)