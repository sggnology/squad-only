package com.sggnology.server.common.aspect

import com.sggnology.server.common.annotation.WithUserInfo
import com.sggnology.server.common.util.UserInfoContextHolder
import com.sggnology.server.db.sql.repository.UserInfoRepository
import org.aspectj.lang.ProceedingJoinPoint
import org.aspectj.lang.annotation.Around
import org.aspectj.lang.annotation.Aspect
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component

/**
 * @WithUserInfo 어노테이션이 붙은 메서드 실행 전후로 UserInfo를 ThreadLocal에 설정하고 제거하는 Aspect입니다.
 */
@Aspect
@Component
class UserInfoAspect(
    private val userInfoRepository: UserInfoRepository
) {

    /**
     * @WithUserInfo 어노테이션이 붙은 메서드 실행 전에 UserInfo를 ThreadLocal에 설정하고,
     * 메서드 실행 후 ThreadLocal을 정리합니다.
     */
    @Around("@annotation(withUserInfo) || @within(withUserInfo)")
    fun aroundWithUserInfo(joinPoint: ProceedingJoinPoint, withUserInfo: WithUserInfo?): Any? {
        try {
            val authentication = SecurityContextHolder.getContext().authentication
                ?: throw IllegalStateException("인증 정보가 없습니다. 로그인이 필요합니다.")

            val userId = authentication.name

            val userInfo = userInfoRepository.findByUserId(userId)
                ?: throw IllegalStateException("사용자 정보를 찾을 수 없습니다. 사용자 ID: $userId")

            // 필요한 경우 여기서 추가 검증도 수행할 수 있습니다
            if (!userInfo.isAccessEnabled()) {
                throw IllegalStateException("계정이 비활성화 되었습니다.")
            }

            // ThreadLocal에 UserInfo 설정
            UserInfoContextHolder.setUserInfo(userInfo)

            // 원본 메서드 실행
            return joinPoint.proceed()
        } finally {
            // ThreadLocal 정리 (메모리 누수 방지를 위해 중요)
            UserInfoContextHolder.clear()
        }
    }
}
