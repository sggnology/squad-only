package com.sggnology.server.db.sql.repository;

import com.sggnology.server.db.sql.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {
}
