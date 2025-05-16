package com.sggnology.server.db.sql.repository;

import com.sggnology.server.db.sql.entity.ResourceInfo;
import com.sggnology.server.db.sql.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceInfoRepository extends JpaRepository<ResourceInfo, Long> {
}
