package com.sggnology.server.db.sql.repository

import com.sggnology.server.db.sql.entity.RoleInfo
import org.springframework.data.jpa.repository.JpaRepository

interface RoleInfoRepository: JpaRepository<RoleInfo, Long> {
    fun findByRole(role: String): RoleInfo?
}