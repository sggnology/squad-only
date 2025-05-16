package com.sggnology.server.db.sql.repository

import com.sggnology.server.db.sql.entity.ConfigInfo
import com.sggnology.server.db.sql.entity.ResourceInfo
import org.springframework.data.jpa.repository.JpaRepository

interface ResourceInfoRepository : JpaRepository<ResourceInfo, Long>
