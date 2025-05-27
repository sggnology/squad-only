package com.sggnology.server.util

import org.slf4j.Logger
import org.slf4j.LoggerFactory

/**
 * Kotlin 클래스에서 Logger를 쉽게 사용하기 위한 확장 함수 모음
 */

// Logger 확장 속성 정의
inline val <reified T> T.logger: Logger
    get(){
        return if(T::class.isCompanion){
            LoggerFactory.getLogger(T::class.java.enclosingClass)
        } else{
            LoggerFactory.getLogger(T::class.java)
        }
    }