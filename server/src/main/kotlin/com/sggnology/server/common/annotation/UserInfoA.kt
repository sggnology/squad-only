package com.sggnology.server.common.annotation

import java.lang.annotation.Documented
import kotlin.annotation.Retention
import kotlin.annotation.AnnotationRetention
import kotlin.annotation.Target
import kotlin.annotation.AnnotationTarget

@Target(AnnotationTarget.VALUE_PARAMETER)
@Retention(AnnotationRetention.RUNTIME)
@Documented
annotation class UserInfoA
