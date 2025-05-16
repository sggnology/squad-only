package com.sggnology.server.db.sql.entity

import com.sggnology.server.db.sql.base.BaseTimeEntity
import jakarta.persistence.*

@Entity
@Table(name = "tag_info")
class TagInfo(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var idx: Long = 0,

    @Column(unique = true)
    var name: String,

    @OneToMany(mappedBy = "tag", cascade = [CascadeType.ALL], orphanRemoval = true)
    val contentTags: MutableSet<ContentTagInfo> = mutableSetOf()
) : BaseTimeEntity() {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is TagInfo) return false
        return idx == other.idx
    }

    override fun hashCode(): Int {
        return if(idx == 0L) return 0 else idx.hashCode()
    }
}
