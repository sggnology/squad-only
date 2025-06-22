package com.sggnology.server.feature.profile.inquiry.service

import com.sggnology.server.common.annotation.WithUserInfo
import com.sggnology.server.common.util.UserInfoContextHolder
import com.sggnology.server.feature.profile.inquiry.data.dto.res.ProfileInquiryResDto
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ProfileInquiryService {

    @WithUserInfo
    @Transactional(readOnly = true)
    fun execute(): ProfileInquiryResDto {
        val userInfo = UserInfoContextHolder.getUserInfo()

        return ProfileInquiryResDto(
            userId = userInfo.userId,
            name = userInfo.name,
            nickname = userInfo.nickname,
            createdAt = userInfo.createdAt
                ?: throw IllegalStateException("createdAt should not be null for persisted entity"),
        )
    }
}
