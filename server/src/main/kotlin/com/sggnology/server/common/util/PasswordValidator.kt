package com.sggnology.server.common.util

import org.springframework.stereotype.Component

/**
 * 비밀번호 검증을 위한 유틸리티 클래스
 */
@Component
class PasswordValidator {

    companion object {
        // 최소 8자, 최대 20자
        private const val MIN_LENGTH = 8
        private const val MAX_LENGTH = 20

        // 정규식: 최소 하나의 대문자, 소문자, 숫자, 특수문자 포함
        private val PASSWORD_PATTERN = Regex("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).{$MIN_LENGTH,$MAX_LENGTH}$")
    }

    /**
     * 비밀번호가 유효한지 검증합니다.
     * @param password 검증할 비밀번호
     * @return 비밀번호 검증 결과
     */
    fun validate(password: String): ValidationResult {
        return when {
            password.length < MIN_LENGTH ->
                ValidationResult(false, "비밀번호는 최소 ${MIN_LENGTH}자 이상이어야 합니다.")
            password.length > MAX_LENGTH ->
                ValidationResult(false, "비밀번호는 최대 ${MAX_LENGTH}자 이하여야 합니다.")
            !password.matches(PASSWORD_PATTERN) ->
                ValidationResult(false, "비밀번호는 대문자, 소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다.")
            else -> ValidationResult(true, "유효한 비밀번호입니다.")
        }
    }

    /**
     * 비밀번호 검증 결과를 담는 데이터 클래스
     */
    data class ValidationResult(val isValid: Boolean, val message: String)
}
