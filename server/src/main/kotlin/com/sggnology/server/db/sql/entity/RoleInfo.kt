package com.sggnology.server.db.sql.entity

import com.sggnology.server.db.sql.base.BaseTimeEntity
import jakarta.persistence.*

@Entity
@Table(name = "role_info")
class RoleInfo(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var idx: Long = 0,

    @Column(name = "role", nullable = false, unique = true)
    var role: String,

    @OneToMany(mappedBy = "roleInfo", cascade = [CascadeType.ALL], orphanRemoval = true)
    var userRoleInfos: MutableList<UserRoleInfo> = mutableListOf()
): BaseTimeEntity() {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is RoleInfo) return false
        return idx == other.idx
    }

    override fun hashCode(): Int {
        return idx.hashCode()
    }
}
