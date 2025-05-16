package com.sggnology.server.db.sql.repository

import com.sggnology.server.db.sql.entity.ConfigInfo
import com.sggnology.server.db.sql.entity.TagInfo
import org.springframework.data.jpa.repository.JpaRepository

interface TagInfoRepository : JpaRepository<TagInfo, Long> {

}
