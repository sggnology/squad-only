package com.sggnology.server.common.annotation

@Target(AnnotationTarget.VALUE_PARAMETER)
@Retention(AnnotationRetention.RUNTIME)
@MustBeDocumented
// TODO: 인증된 사용자 정보를 획득하는 용도였으나, WithUseInfo 로 대체되어 삭제해도됨
annotation class UserInfoA
