package com.sggnology.server.db.sql.repository

import com.sggnology.server.db.sql.entity.FileInfo
import org.springframework.data.jpa.repository.JpaRepository

interface FileInfoRepository : JpaRepository<FileInfo, Long> {
    fun findByIdxIn(idxs: List<Long>): List<FileInfo>
}