package com.sggnology.server.db.sql.entity

import com.sggnology.server.db.sql.base.BaseTimeEntity
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table

@Entity
@Table(name = "user_role_info")
class UserRoleInfo(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var idx: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY) // Use LAZY fetch type usually
    @JoinColumn(name = "user_idx", nullable = false)
    val userInfo: UserInfo, // Non-nullable reference

    @ManyToOne(fetch = FetchType.LAZY) // Use LAZY fetch type usually
    @JoinColumn(name = "role_idx", nullable = false)
    val roleInfo: RoleInfo, // Non-nullable reference
) : BaseTimeEntity()