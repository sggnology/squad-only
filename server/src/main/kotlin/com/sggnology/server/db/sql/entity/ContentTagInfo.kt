package com.sggnology.server.db.sql.entity

import com.sggnology.server.db.sql.base.BaseTimeEntity
import jakarta.persistence.*

@Entity
@Table(name = "content_tag_info")
class ContentTagInfo(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var idx: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY) // Use LAZY fetch type usually
    @JoinColumn(name = "content_idx", nullable = false)
    val content: ContentInfo, // Non-nullable reference

    @ManyToOne(fetch = FetchType.LAZY) // Use LAZY fetch type usually
    @JoinColumn(name = "tag_idx", nullable = false)
    val tag: TagInfo, // Non-nullable reference
) : BaseTimeEntity()
