package com.sggnology.server.db.sql.repository

import com.sggnology.server.db.sql.entity.ConfigInfo
import org.springframework.data.jpa.repository.JpaRepository

interface ConfigInfoRepository : JpaRepository<ConfigInfo, Long>
