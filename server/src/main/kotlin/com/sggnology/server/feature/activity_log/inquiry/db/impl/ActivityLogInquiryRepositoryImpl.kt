package com.sggnology.server.feature.activity_log.inquiry.db.impl

import com.querydsl.jpa.impl.JPAQueryFactory
import com.sggnology.server.db.sql.entity.ActivityLogInfo
import com.sggnology.server.db.sql.entity.QActivityLogInfo
import com.sggnology.server.feature.activity_log.inquiry.db.ActivityLogInquiryRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable

class ActivityLogInquiryRepositoryImpl(
    private val queryFactory: JPAQueryFactory
): ActivityLogInquiryRepository {

    private val activityLogInfo = QActivityLogInfo.activityLogInfo

    override fun inquire(
        pageable: Pageable,
        userId: String?
    ): Page<ActivityLogInfo> {

        val contentQuery = queryFactory
            .selectFrom(activityLogInfo)
            .where(
                userId?.let { activityLogInfo.userId.eq(it) }
            )
            .orderBy(
                activityLogInfo.createdAt.desc()
            )
            .offset(pageable.offset)
            .limit(pageable.pageSize.toLong())

        val countQuery = queryFactory
            .select(activityLogInfo.count())
            .from(activityLogInfo)
            .where(
                userId?.let { activityLogInfo.userId.eq(it) }
            )

        return PageImpl(
            contentQuery.fetch(),
            pageable,
            countQuery.fetchOne() ?: 0L
        )
    }
}