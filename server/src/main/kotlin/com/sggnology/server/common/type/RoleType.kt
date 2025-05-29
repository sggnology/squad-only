package com.sggnology.server.common.type

import com.sggnology.server.db.sql.entity.RoleInfo
import com.sggnology.server.db.sql.repository.RoleInfoRepository

enum class RoleType(val roleName: String, val description: String) {
    USER("ROLE_USER", "일반 사용자 권한"),
    ADMIN("ROLE_ADMIN", "관리자 권한");
//    SUPER_ADMIN("ROLE_SUPER_ADMIN", "최고 관리자 권한");

    companion object {
        /**
         * RoleInfo 엔티티로부터 해당하는 RoleType을 찾아 반환합니다.
         */
        fun from(roleInfo: RoleInfo): RoleType {
            return RoleType.entries.find { it.roleName == roleInfo.role }
                ?: throw IllegalArgumentException("해당하는 RoleType이 없습니다: ${roleInfo.role}")
        }

        /**
         * 역할 이름으로부터 해당하는 RoleType을 찾아 반환합니다.
         */
        fun fromName(roleName: String): RoleType {
            return RoleType.entries.find { it.roleName == roleName }
                ?: throw IllegalArgumentException("해당하는 RoleType이 없습니다: $roleName")
        }
    }

    fun toRoleInfo(roleInfoRepository: RoleInfoRepository): RoleInfo {
        return roleInfoRepository.findByRole(this.roleName)
            ?: throw IllegalArgumentException("해당하는 RoleInfo가 없습니다: ${this.roleName}")
    }
}