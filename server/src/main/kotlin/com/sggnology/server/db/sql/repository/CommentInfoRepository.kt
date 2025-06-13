package com.sggnology.server.db.sql.repository

import com.sggnology.server.db.sql.entity.CommentInfo
import com.sggnology.server.feature.comment.inquiry.db.CommentInquiryRepository
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface CommentInfoRepository : JpaRepository<CommentInfo, Long>, CommentInquiryRepository {
    
    @Query("SELECT COUNT(c) FROM CommentInfo c WHERE c.contentInfo.idx = :contentIdx AND c.isDeleted = false")
    fun countByContentIdxAndIsDeletedFalse(@Param("contentIdx") contentIdx: Long): Long
    
    fun findByIdxAndIsDeletedFalse(idx: Long): CommentInfo?
}
