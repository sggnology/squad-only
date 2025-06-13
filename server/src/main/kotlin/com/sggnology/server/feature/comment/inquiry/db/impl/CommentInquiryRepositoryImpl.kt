package com.sggnology.server.feature.comment.inquiry.db.impl

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
        
        val contentQuery = queryFactory
            .selectFrom(commentInfo)
            .leftJoin(commentInfo.user).fetchJoin()
            .where(
                commentInfo.contentInfo.idx.eq(contentIdx)
                    .and(commentInfo.isDeleted.eq(false))
            )
            .orderBy(commentInfo.createdAt.desc()) // 댓글은 등록순으로 표시
            .offset(pageable.offset)
            .limit(pageable.pageSize.toLong())

        val content = contentQuery.fetch()

        val countQuery = queryFactory
            .select(commentInfo.count())
            .from(commentInfo)
            .where(
                commentInfo.contentInfo.idx.eq(contentIdx)
                    .and(commentInfo.isDeleted.eq(false))
            )

        val total = countQuery.fetchOne() ?: 0L

        return PageImpl(content, pageable, total)
    }
}
