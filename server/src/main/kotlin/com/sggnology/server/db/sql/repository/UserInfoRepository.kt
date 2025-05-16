package com.sggnology.server.db.sql.repository

import com.sggnology.server.db.sql.entity.ConfigInfo
import com.sggnology.server.db.sql.entity.UserInfo
import org.springframework.data.jpa.repository.JpaRepository

interface UserInfoRepository : JpaRepository<UserInfo, Long>
