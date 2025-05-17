package com.sggnology.server.feature.file.inquiry.service

import com.sggnology.server.db.sql.entity.FileInfo
import com.sggnology.server.db.sql.repository.FileInfoRepository
import com.sggnology.server.feature.file.inquiry.data.model.FileInquiryModel
import org.springframework.core.io.Resource
import org.springframework.core.io.UrlResource
import org.springframework.stereotype.Service
import java.nio.file.Path

@Service
class FileInquiryService(
    private val fileInfoRepository: FileInfoRepository
) {

    fun execute(idx: Long): FileInquiryModel {
        val fileInfo: FileInfo = fileInfoRepository.findById(idx)
            .orElseThrow { IllegalArgumentException("파일을 찾을 수 없습니다. IDX: $idx") }

        val filePath: Path = Path.of(fileInfo.path, fileInfo.storedName)
        val resource: Resource = UrlResource(filePath.toUri())

        if (!resource.exists() || !resource.isReadable) {
            throw IllegalArgumentException("파일을 읽을 수 없습니다. 경로: $filePath")
        }

        return FileInquiryModel(
            resource = resource,
            fileInfo = fileInfo
        )
    }
}