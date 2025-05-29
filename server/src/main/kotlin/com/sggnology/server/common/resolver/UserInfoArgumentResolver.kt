package com.sggnology.server.common.resolver

import com.sggnology.server.common.annotation.UserInfoA
import com.sggnology.server.db.sql.entity.UserInfo
import com.sggnology.server.db.sql.repository.UserInfoRepository
import org.springframework.core.MethodParameter
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.bind.support.WebDataBinderFactory
import org.springframework.web.context.request.NativeWebRequest
import org.springframework.web.method.support.HandlerMethodArgumentResolver
import org.springframework.web.method.support.ModelAndViewContainer

@Component
class UserInfoArgumentResolver(
    private val userInfoRepository: UserInfoRepository
) : HandlerMethodArgumentResolver {

    override fun supportsParameter(parameter: MethodParameter): Boolean {
        return parameter.hasParameterAnnotation(UserInfoA::class.java) &&
            parameter.parameterType == UserInfo::class.java
    }

    override fun resolveArgument(
        parameter: MethodParameter,
        mavContainer: ModelAndViewContainer?,
        webRequest: NativeWebRequest,
        binderFactory: WebDataBinderFactory?
    ): UserInfo {
        val authentication = SecurityContextHolder.getContext().authentication
            ?: throw IllegalStateException("인증 정보가 없습니다. 로그인이 필요합니다.")

        val userId = authentication.name

        val userInfo = userInfoRepository.findByUserId(userId)
            ?: throw IllegalStateException("사용자 정보를 찾을 수 없습니다. 사용자 ID: $userId")

        if(!userInfo.isAccessEnabled()){
            throw IllegalStateException("사용자 계정이 비활성화 되었습니다. 사용자 ID: $userId")
        }

        return userInfo

        // 나중에 필요한 경우 isEnabled 체크를 여기서 수행할 수 있습니다.
        // if(!userInfo.isEnabled) throw IllegalStateException("계정이 비활성화 되었습니다.")
    }
}
