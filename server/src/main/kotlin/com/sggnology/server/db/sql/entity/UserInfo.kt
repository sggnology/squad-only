package com.sggnology.server.db.sql.entity

import com.sggnology.server.db.sql.base.BaseTimeEntity
import jakarta.persistence.*

@Entity
@Table(name = "user_info")
class UserInfo(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var idx: Long = 0,

    var userId: String,

    var userPw: String,

    var name: String,

    var nickname: String?,

    var isDeleted: Boolean = false,

    @OneToMany(mappedBy = "registeredUser", cascade = [CascadeType.PERSIST, CascadeType.MERGE])
    val contents: MutableSet<ContentInfo> = mutableSetOf()
) : BaseTimeEntity() {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is UserInfo) return false
        return idx == other.idx
    }

    override fun hashCode(): Int {
        return if(idx == 0L) return 0 else idx.hashCode()
    }

}
