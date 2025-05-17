package com.sggnology.server.common.util

import com.sggnology.server.config.FileProperties
import org.springframework.stereotype.Component
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.*

@Component
class FileUploadUtil(
    private val fileProperties: FileProperties
) {
    fun isImageFile(file: MultipartFile): Boolean {
        return file.contentType?.startsWith("image/") ?: false
    }

    fun createTempDirectory(): Path {
        val tempPath = Paths.get(fileProperties.tempDir)
        if (!Files.exists(tempPath)) {
            Files.createDirectories(tempPath)
        }
        return tempPath
    }

    fun createStorageDirectory(): Path {
        val today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
        val storagePath = Paths.get(fileProperties.storageDir, today)
        if (!Files.exists(storagePath)) {
            Files.createDirectories(storagePath)
        }
        return storagePath
    }

    fun generateStoredFileName(originalFilename: String): String {
        val extension = originalFilename.substringAfterLast(".", "")
        return "${UUID.randomUUID()}.$extension"
    }

    fun saveToTempDirectory(file: MultipartFile): Path {
        val tempDir = createTempDirectory()
        val storedFileName = generateStoredFileName(file.originalFilename ?: "unknown")
        val targetPath = tempDir.resolve(storedFileName)

        Files.copy(file.inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING)
        return targetPath
    }

    fun moveFileToStorage(sourcePath: Path): Path {
        val storageDir = createStorageDirectory()
        val fileName = sourcePath.fileName
        val targetPath = storageDir.resolve(fileName)

        Files.move(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING)
        return targetPath
    }

    fun getFileExtension(filename: String): String {
        return filename.substringAfterLast(".", "")
    }
}