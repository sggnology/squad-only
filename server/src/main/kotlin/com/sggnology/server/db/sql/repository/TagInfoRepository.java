package com.sggnology.server.db.sql.repository;

import com.sggnology.server.db.sql.entity.TagInfo;
import com.sggnology.server.db.sql.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagInfoRepository extends JpaRepository<TagInfo, Long> {
}
