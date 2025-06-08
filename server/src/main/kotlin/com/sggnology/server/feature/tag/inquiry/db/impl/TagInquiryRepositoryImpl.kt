package com.sggnology.server.feature.tag.inquiry.db.impl

import com.querydsl.jpa.impl.JPAQueryFactory
import com.sggnology.server.db.sql.entity.QTagInfo
import com.sggnology.server.db.sql.entity.TagInfo
import com.sggnology.server.feature.tag.inquiry.db.TagInquiryRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable

class TagInquiryRepositoryImpl(
    private val queryFactory: JPAQueryFactory
): TagInquiryRepository {

    private val tagInfo = QTagInfo.tagInfo

    override fun inquire(pageable: Pageable, search: String?): Page<TagInfo> {

        val searchCondition = if (search.isNullOrBlank()) null else tagInfo.name.containsIgnoreCase(search)

        val contentQuery = queryFactory
            .selectFrom(tagInfo)
            .orderBy(tagInfo.createdAt.desc(), tagInfo.idx.desc())
            .where(searchCondition)
            .offset(pageable.offset)
            .limit(pageable.pageSize.toLong())

        val countQuery = queryFactory
            .select(tagInfo.count())
            .where(searchCondition)
            .from(tagInfo)

        return PageImpl(
            contentQuery.fetch(),
            pageable,
            countQuery.fetchOne() ?: 0L
        )
    }
}