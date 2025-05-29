package com.sggnology.server.common.util

import com.sggnology.server.db.sql.entity.UserInfo

/**
 * 현재 스레드에서 UserInfo 객체를 보관하기 위한 ThreadLocal 유틸리티입니다.
 */
object UserInfoContextHolder {
    private val userInfoHolder = ThreadLocal<UserInfo>()

    /**
     * 현재 스레드에 UserInfo 객체를 저장합니다.
     */
    fun setUserInfo(userInfo: UserInfo) {
        userInfoHolder.set(userInfo)
    }

    /**
     * 현재 스레드에 저장된 UserInfo 객체를 가져옵니다.
     * @throws IllegalStateException UserInfo가 설정되지 않은 경우
     */
    fun getUserInfo(): UserInfo {
        return userInfoHolder.get()
            ?: throw IllegalStateException("UserInfo가 설정되지 않았습니다. @WithUserInfo 어노테이션이 적용된 메소드 내에서만 호출해야 합니다.")
    }

    /**
     * 현재 스레드에서 UserInfo 객체를 제거합니다.
     */
    fun clear() {
        userInfoHolder.remove()
    }
}
