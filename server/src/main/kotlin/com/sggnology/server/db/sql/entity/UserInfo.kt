package com.sggnology.server.db.sql.entity

import com.sggnology.server.db.sql.base.BaseTimeEntity
import jakarta.persistence.*
import java.time.Instant

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

    var isEnabled: Boolean = true,

    var isDeleted: Boolean = false,

    @Column(columnDefinition = "TIMESTAMPTZ")
    var lastLoginAt: Instant? = null,

    @OneToMany(mappedBy = "userInfo", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.EAGER)
    val userRoleInfos: MutableList<UserRoleInfo> = mutableListOf(),

    @OneToMany(mappedBy = "registeredUser", cascade = [CascadeType.PERSIST, CascadeType.MERGE])
    val contentInfos: MutableSet<ContentInfo> = mutableSetOf()
) : BaseTimeEntity() {

    // 역할 추가
    fun addRole(roleInfo: RoleInfo) {
        userRoleInfos.add(
            UserRoleInfo(
                userInfo = this,
                roleInfo = roleInfo
            )
        )
    }

    fun deleteRole(roleInfo: RoleInfo) {
        userRoleInfos.removeIf { it.roleInfo == roleInfo }
    }

    // 사용자의 권한 목록 가져오기
    fun getRoleList(): List<String> {
        return userRoleInfos.map { it.roleInfo.role }
    }

    // 사용자 활성화 여부 확인
    fun isAccessEnabled(): Boolean {
        return isEnabled && !isDeleted
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is UserInfo) return false
        return idx == other.idx
    }

    override fun hashCode(): Int {
        return if(idx == 0L) return 0 else idx.hashCode()
    }

}
