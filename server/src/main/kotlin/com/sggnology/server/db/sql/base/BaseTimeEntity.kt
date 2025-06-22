package com.sggnology.server.db.sql.base

import jakarta.persistence.Column
import jakarta.persistence.EntityListeners
import jakarta.persistence.MappedSuperclass
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.Instant

@MappedSuperclass
@EntityListeners(AuditingEntityListener::class)
class BaseTimeEntity(
    // 엔티티가 생성될 때 시간이 자동으로 저장됩니다.
    @CreatedDate
    @Column(
        name = "created_at",
        updatable = false, // 생성 시간은 업데이트되지 않도록 설정
        nullable = false,
        columnDefinition = "TIMESTAMPTZ"
    )
    var createdAt: Instant? = null, // JPA Auditing이 자동으로 설정

    // 엔티티가 수정될 때 시간이 자동으로 저장됩니다.
    @LastModifiedDate
    @Column(
        name = "updated_at",
        nullable = false,
        columnDefinition = "TIMESTAMPTZ"
    )
    var updatedAt: Instant? = null // JPA Auditing이 자동으로 설정
)