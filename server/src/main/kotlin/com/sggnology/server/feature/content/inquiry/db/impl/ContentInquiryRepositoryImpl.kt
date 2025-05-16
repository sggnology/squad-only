package com.sggnology.server.feature.content.inquiry.db.impl

import com.querydsl.core.types.dsl.Expressions
import com.querydsl.jpa.impl.JPAQueryFactory
import com.sggnology.server.db.sql.entity.QContentInfo
import com.sggnology.server.feature.content.inquiry.data.dto.ContentInquiryResDto
import com.sggnology.server.feature.content.inquiry.data.dto.QContentInquiryResDto
import com.sggnology.server.feature.content.inquiry.db.base.ContentInquiryRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Repository

@Repository
class ContentInquiryRepositoryImpl(
    private val queryFactory: JPAQueryFactory
) : ContentInquiryRepository {

    private val contentInfo = QContentInfo.contentInfo

    override fun inquire(pageable: Pageable): Page<ContentInquiryResDto> {

        val content: List<ContentInquiryResDto> = queryFactory
            .select(
                QContentInquiryResDto(
                    contentInfo.idx,
                    Expressions.constant("https://placehold.co/300"),
                    contentInfo.title,
                    contentInfo.location,
                    contentInfo.description,
                    contentInfo.createdAt
                )
            )
            .from(contentInfo)
            .where(
                contentInfo.isDeleted.eq(false)
            )
            .offset(pageable.offset)
            .limit(pageable.pageSize.toLong())
            .fetch()

        content.forEach {
            it.tags.addAll(listOf("tag1", "tag2"))
        }

        val total: Long = queryFactory
            .select(contentInfo.count())
            .from(contentInfo)
            .where(
                contentInfo.isDeleted.eq(false)
            )
            .fetchOne() ?: 0L

        return PageImpl(content, pageable, total)
    }
}