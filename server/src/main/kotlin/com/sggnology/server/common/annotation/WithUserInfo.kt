package com.sggnology.server.common.annotation

/**
 * 이 어노테이션이 붙은 메서드에서는 ThreadLocal을 통해 현재 사용자 정보(UserInfo)에 접근할 수 있습니다.
 */
@Target(AnnotationTarget.FUNCTION, AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class WithUserInfo
