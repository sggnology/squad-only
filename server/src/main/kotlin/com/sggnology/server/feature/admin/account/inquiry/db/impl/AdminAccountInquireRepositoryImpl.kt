package com.sggnology.server.feature.admin.account.inquiry.db.impl

import com.querydsl.jpa.impl.JPAQueryFactory
import com.sggnology.server.db.sql.entity.QUserInfo
import com.sggnology.server.db.sql.entity.UserInfo
import com.sggnology.server.feature.admin.account.inquiry.db.AdminAccountInquireRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable

class AdminAccountInquireRepositoryImpl(
    private val queryFactory: JPAQueryFactory
) : AdminAccountInquireRepository {

    private val userInfo = QUserInfo.userInfo

    override fun inquire(pageable: Pageable): Page<UserInfo> {

        val contentQuery = queryFactory.selectFrom(userInfo)
            .orderBy(userInfo.lastLoginAt.desc(), userInfo.isEnabled.desc())
            .offset(pageable.offset)
            .limit(pageable.pageSize.toLong())

        val content = contentQuery.fetch()

        val total: Long = queryFactory
            .select(userInfo.count())
            .from(userInfo)
            .fetchOne() ?: 0L

        return PageImpl(content, pageable, total)
    }

}