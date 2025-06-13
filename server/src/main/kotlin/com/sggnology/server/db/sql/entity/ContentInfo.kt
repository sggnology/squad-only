package com.sggnology.server.db.sql.entity

import com.sggnology.server.db.sql.base.BaseTimeEntity
import jakarta.persistence.*

@Entity
@Table(name = "content_info")
class ContentInfo(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var idx: Long = 0,

    var title: String,

    var description: String,

    var location: String,

    var isDeleted: Boolean = false,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registered_user_idx", nullable = true)
    var registeredUser: UserInfo? = null, // Non-nullable reference

    @OneToMany(mappedBy = "content", cascade = [CascadeType.ALL], orphanRemoval = true)
    val contentTags: MutableSet<ContentTagInfo> = mutableSetOf(),

    @OneToMany(mappedBy = "contentInfo", cascade = [CascadeType.PERSIST, CascadeType.MERGE]) // Example cascades
    val fileInfos: MutableSet<FileInfo> = mutableSetOf(),

    @OneToMany(mappedBy = "contentInfo", fetch = FetchType.LAZY)
    val comments: MutableSet<CommentInfo> = mutableSetOf()
) : BaseTimeEntity(){

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is ContentInfo) return false
        return idx == other.idx
    }

    override fun hashCode(): Int {
        return if(idx == 0L) return 0 else idx.hashCode()
    }
}
