package com.sggnology.server.feature.content.inquiry.db.impl

import com.querydsl.core.BooleanBuilder
import com.querydsl.jpa.impl.JPAQueryFactory
import com.sggnology.server.db.sql.entity.ContentInfo
import com.sggnology.server.db.sql.entity.QContentInfo
import com.sggnology.server.feature.content.inquiry.db.ContentInquiryRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable

class ContentInquiryRepositoryImpl(
    private val queryFactory: JPAQueryFactory
) : ContentInquiryRepository {

    private val contentInfo = QContentInfo.contentInfo

    override fun inquire(
        pageable: Pageable,
        search: String?,
        tags: List<String>,
        userId: String?
    ): Page<ContentInfo> {

        // 기본 조건: 삭제되지 않은 콘텐츠
        val basePredicate = contentInfo.isDeleted.eq(false)

        // 검색어 및 태그 관련 조건을 담을 BooleanBuilder
        val searchAndTagConditions = BooleanBuilder()

        if (!search.isNullOrBlank()) {
            // 검색어가 있으면 제목 또는 등록자 이름에 대한 OR 조건 추가
            searchAndTagConditions.or(contentInfo.title.containsIgnoreCase(search))
            searchAndTagConditions.or(contentInfo.registeredUser.name.containsIgnoreCase(search))
        }

        if (tags.isNotEmpty()) {
            // 태그가 있으면 태그 이름에 대한 OR 조건 추가
            searchAndTagConditions.or(contentInfo.contentTags.any().tag.name.`in`(tags))
        }

        if (!userId.isNullOrBlank()) {
            // 특정 사용자 ID가 주어진 경우 해당 사용자에 대한 조건 추가
            searchAndTagConditions.and(contentInfo.registeredUser.userId.eq(userId))
        }

        // 최종 WHERE 조건: 기본 조건 AND (검색어/태그 조건들)
        // 검색어/태그 조건이 하나라도 있는 경우에만 AND로 결합
        val finalPredicate = if (searchAndTagConditions.hasValue()) {
            basePredicate.and(searchAndTagConditions)
        } else {
            basePredicate // 검색어/태그 조건이 없으면 기본 조건만 사용
        }

        val ids = queryFactory
            .select(contentInfo.idx)
            .from(contentInfo)
            .where(finalPredicate)
            .orderBy(contentInfo.createdAt.desc(), contentInfo.idx.desc())
            .offset(pageable.offset)
            .limit(pageable.pageSize.toLong())
            .fetch()

        if( ids.isEmpty()) {
            return PageImpl(emptyList(), pageable, 0L)
        }

        val contentQuery = queryFactory
            .selectFrom(contentInfo).distinct()
            .leftJoin(contentInfo.registeredUser).fetchJoin()
            .leftJoin(contentInfo.contentTags).fetchJoin()
            .where(contentInfo.idx.`in`(ids))
            .orderBy(
                contentInfo.createdAt.desc(), contentInfo.idx.desc()
            )

        val content: List<ContentInfo> = contentQuery.fetch()

        val total: Long = queryFactory
            .select(contentInfo.countDistinct())
            .from(contentInfo)
            .leftJoin(contentInfo.registeredUser)
            .leftJoin(contentInfo.contentTags)
            .where(finalPredicate)
            .fetchOne() ?: 0L

        return PageImpl(content, pageable, total)
    }
}