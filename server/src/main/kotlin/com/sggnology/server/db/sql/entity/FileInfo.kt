package com.sggnology.server.db.sql.entity

import com.sggnology.server.db.sql.base.BaseTimeEntity
import jakarta.persistence.*

@Entity
@Table(name = "file_info")
class FileInfo(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var idx: Long = 0,

    @Column(nullable = false)
    val originalName: String,

    @Column(nullable = false)
    val storedName: String,

    @Column(nullable = false)
    var path: String,

    @Column(nullable = false)
    val extension: String,

    @Column(nullable = false)
    val size: Long,

    @Column(nullable = false)
    val contentType: String,

    // 임시 저장 여부
    @Column(nullable = false)
    var temporary: Boolean = true,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_idx")
    var contentInfo: ContentInfo? = null
) : BaseTimeEntity() {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is FileInfo) return false
        return idx == other.idx
    }

    override fun hashCode(): Int {
        return if(idx == 0L) return 0 else idx.hashCode()
    }
}
