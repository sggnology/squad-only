package com.sggnology.server.feature.comment.inquiry.db.impl

import com.querydsl.core.BooleanBuilder
import com.querydsl.jpa.impl.JPAQueryFactory
import com.sggnology.server.db.sql.entity.CommentInfo
import com.sggnology.server.db.sql.entity.QCommentInfo
import com.sggnology.server.feature.comment.inquiry.db.CommentInquiryRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable

class CommentInquiryRepositoryImpl(
    private val queryFactory: JPAQueryFactory
) : CommentInquiryRepository {

    private val commentInfo = QCommentInfo.commentInfo

    override fun inquire(
        pageable: Pageable,
        contentIdx: Long
    ): Page<CommentInfo> {

        val basePredicate = commentInfo.contentInfo.idx.eq(contentIdx)
            .and(commentInfo.isDeleted.eq(false)) // 기본 조건: 삭제되지 않은 댓글
        
        val contentQuery = queryFactory
            .selectFrom(commentInfo)
            .leftJoin(commentInfo.registeredUser).fetchJoin()
            .where(basePredicate)
            .orderBy(commentInfo.createdAt.desc()) // 댓글은 등록순으로 표시
            .offset(pageable.offset)
            .limit(pageable.pageSize.toLong())

        val content = contentQuery.fetch()

        val countQuery = queryFactory
            .select(commentInfo.count())
            .from(commentInfo)
            .where(basePredicate)

        val total = countQuery.fetchOne() ?: 0L

        return PageImpl(content, pageable, total)
    }
}
