package com.sggnology.server.feature.profile.modification.service

import com.sggnology.server.common.annotation.WithUserInfo
import com.sggnology.server.common.util.ClientIPHolder
import com.sggnology.server.common.util.UserInfoContextHolder
import com.sggnology.server.db.sql.repository.UserInfoRepository
import com.sggnology.server.feature.activity_log.handler.event.ProfileUpdateLogEvent
import com.sggnology.server.feature.profile.modification.data.dto.res.ProfileModificationResDto
import com.sggnology.server.feature.profile.modification.data.model.ProfileModifyModel
import org.springframework.context.ApplicationEventPublisher
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ProfileModificationService(
    private val userInfoRepository: UserInfoRepository,
    private val eventPublisher: ApplicationEventPublisher
) {

    @WithUserInfo
    @Transactional
    fun execute(
        profileModifyModel: ProfileModifyModel,
    ): ProfileModificationResDto {
        val userInfo = UserInfoContextHolder.getUserInfo()
        userInfo
            .apply {
                this.name = profileModifyModel.name
                this.nickname = profileModifyModel.nickname
            }.also {
                userInfoRepository.save(it)
            }

        // 프로필 수정 이벤트 발행
        eventPublisher.publishEvent(
            ProfileUpdateLogEvent(
                userId = userInfo.userId,
                username = userInfo.name,
                changes = mapOf(
                    "name" to profileModifyModel.name,
                    "nickname" to profileModifyModel.nickname
                ).toString(),
                ip = ClientIPHolder.get()
            )
        )

        return ProfileModificationResDto(
            name = userInfo.name,
            nickname = userInfo.nickname
        )
    }
}