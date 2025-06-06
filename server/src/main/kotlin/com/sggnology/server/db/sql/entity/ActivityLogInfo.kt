package com.sggnology.server.db.sql.entity

import com.sggnology.server.db.sql.base.BaseTimeEntity
import com.sggnology.server.feature.activity_log.type.ActivityLogType
import jakarta.persistence.*

@Entity
@Table(name = "activity_log_info")
data class ActivityLogInfo(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val idx: Long = 0,

    @Column(nullable = false)
    val userId: String,

    @Column(nullable = false)
    val username: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val type: ActivityLogType,

    @Column(nullable = false)
    val description: String,

    @Column
    val targetId: String? = null, // 컨텐츠ID 등

    @Column
    val ip: String? = null
): BaseTimeEntity()