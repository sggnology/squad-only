package com.sggnology.server.db.sql.repository

import com.sggnology.server.db.sql.entity.UserInfo
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserInfoRepository : JpaRepository<UserInfo, Long> {
    fun findByUserId(userId: String): UserInfo?
    fun existsByUserId(userId: String): Boolean
}
