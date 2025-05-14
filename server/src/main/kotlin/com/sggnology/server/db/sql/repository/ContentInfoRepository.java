package com.sggnology.server.db.sql.repository;

import com.sggnology.server.db.sql.entity.ContentInfo;
import com.sggnology.server.db.sql.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContentInfoRepository extends JpaRepository<ContentInfo, Long> {
}
