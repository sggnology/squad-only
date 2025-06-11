package com.sggnology.server.db.sql.entity

import com.sggnology.server.db.sql.base.BaseTimeEntity
import jakarta.persistence.*

@Entity
@Table(name = "comment_info")
class CommentInfo(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var idx: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_idx", nullable = false)
    val content: ContentInfo,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_idx", nullable = false)
    val user: UserInfo,

    @Column(nullable = false, columnDefinition = "TEXT")
    var comment: String,

    @Column(nullable = false)
    var isDeleted: Boolean = false
) : BaseTimeEntity()
