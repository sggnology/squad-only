package com.sggnology.server.feature.content.inquiry.db.impl

import com.querydsl.core.types.Order
import com.querydsl.core.types.OrderSpecifier
import com.querydsl.core.types.dsl.PathBuilder
import com.querydsl.jpa.impl.JPAQueryFactory
import com.sggnology.server.db.sql.entity.ContentInfo
import com.sggnology.server.db.sql.entity.QContentInfo
import com.sggnology.server.feature.content.inquiry.db.ContentInquiryRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort

class ContentInquiryRepositoryImpl(
    private val queryFactory: JPAQueryFactory
) : ContentInquiryRepository {

    private val contentInfo = QContentInfo.contentInfo

    override fun inquire(pageable: Pageable): Page<ContentInfo> {

        val orderSpecifiers = pageable.sort.mapNotNull { order: Sort.Order ->
            val direction = if (order.direction == Sort.Direction.ASC) Order.ASC else Order.DESC
            val path = PathBuilder(contentInfo.type, contentInfo.metadata)
            try {
                // 잘못된 캐스팅 제거
                // path.get(...)이 반환하는 Expression은 OrderSpecifier 생성자에 바로 사용 가능
                OrderSpecifier(direction, path.get(order.property, Comparable::class.java))
            } catch (e: Exception) {
                // 프로퍼티를 찾을 수 없는 경우 또는 다른 예외 발생 시 null 반환
                // mapNotNull에 의해 필터링됨
                // 로깅 등을 추가하여 디버깅 용이성 확보 가능
                null
            }
        }.toTypedArray()

        val contentQuery = queryFactory
            .selectFrom(contentInfo)
            .where(
                contentInfo.isDeleted.eq(false)
            )
            .offset(pageable.offset)
            .limit(pageable.pageSize.toLong())

        if(orderSpecifiers.isEmpty()){
            contentQuery.orderBy(*orderSpecifiers)
        }
        else{
            contentQuery.orderBy(contentInfo.createdAt.desc(), contentInfo.idx.desc())
        }

        val content: List<ContentInfo> = contentQuery.fetch()

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