package com.sggnology.server.feature.admin.account.inquiry.db

import com.sggnology.server.db.sql.entity.UserInfo
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

interface AdminAccountInquireRepository {
    fun inquire(pageable: Pageable): Page<UserInfo>
}