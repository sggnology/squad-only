package com.sggnology.server.feature.file.upload.service

import com.sggnology.server.common.util.FileUploadUtil
import com.sggnology.server.db.sql.entity.FileInfo
import com.sggnology.server.db.sql.repository.FileInfoRepository
import com.sggnology.server.feature.file.upload.data.model.FileAttachToContentModel
import com.sggnology.server.feature.file.upload.data.model.FileMoveToStorageModel
import com.sggnology.server.feature.file.upload.data.model.FileUploadTempModel
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Path

@Service
class FileUploadService(
    private val fileUploadUtil: FileUploadUtil,
    private val fileInfoRepository: FileInfoRepository
) {

    fun execute(fileUploadTempModel: FileUploadTempModel): List<Long> {
        // 이미지 파일만 필터링
        val imageFiles = fileUploadTempModel.files.filter { fileUploadUtil.isImageFile(it) }

        if (imageFiles.isEmpty()) {
            throw IllegalArgumentException("이미지 파일만 업로드 가능합니다.")
        }

        return imageFiles.map { file ->
            val savedPath = fileUploadUtil.saveToTempDirectory(file)
            createFileInfo(file, savedPath, true)
        }.map {
            it.idx
        }
    }

    fun execute(fileMoveToStorageModel: FileMoveToStorageModel): List<FileInfo> {

        val fileInfos = mutableSetOf<FileInfo>()

        fileMoveToStorageModel.fileIdxs.forEach { fileIdx ->
            val fileInfo = fileInfoRepository.findById(fileIdx)
                .orElseThrow { IllegalArgumentException("파일을 찾을 수 없습니다. IDX: $fileIdx") }

            fileInfos.add(fileInfo)
        }

        return fileInfos.map { fileInfo ->
            val sourcePath = Path.of(fileInfo.path, fileInfo.storedName)
            val targetPath = fileUploadUtil.moveFileToStorage(sourcePath)

            // DB 업데이트
            fileInfo.path = targetPath.parent.toString()
            fileInfo.temporary = false
            fileInfoRepository.save(fileInfo)
        }
    }

    fun execute(fileAttachToContentModel: FileAttachToContentModel) {

        // contentInfo.fileInfos 동기화
        fileAttachToContentModel.contentInfo.fileInfos.addAll(
            fileAttachToContentModel.fileInfos
        )

        // fileInfo.contentInfo 동기화
        fileAttachToContentModel.fileInfos.forEach { fileInfo ->
            fileInfo.contentInfo = fileAttachToContentModel.contentInfo
            fileInfoRepository.save(fileInfo)
        }
    }

    private fun createFileInfo(file: MultipartFile, savedPath: Path, temporary: Boolean): FileInfo {
        val originalName = file.originalFilename ?: "unknown"
        val storedName = savedPath.fileName.toString()

        return FileInfo(
            originalName = originalName,
            storedName = storedName,
            path = savedPath.parent.toString(),
            extension = fileUploadUtil.getFileExtension(originalName),
            size = file.size,
            contentType = file.contentType ?: "application/octet-stream",
            temporary = temporary
        ).also { fileInfoRepository.save(it) }
    }
}