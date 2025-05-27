package com.sggnology.server.feature.admin.account.modification.service

import com.sggnology.server.db.sql.repository.UserInfoRepository
import com.sggnology.server.feature.admin.account.modification.data.dto.res.AdminAccountToggleIsEnabledStatusResDto
import com.sggnology.server.feature.admin.account.modification.data.model.AdminDeleteAccountModel
import com.sggnology.server.feature.admin.account.modification.data.model.AdminToggleAccountIsEnabledStatusModel
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AdminAccountModificationService(
    private val userInfoRepository: UserInfoRepository
) {

    @Transactional
    fun execute(
        adminToggleAccountIsEnabledStatusModel: AdminToggleAccountIsEnabledStatusModel
    ): AdminAccountToggleIsEnabledStatusResDto {
        val userInfo = userInfoRepository.findByUserId(adminToggleAccountIsEnabledStatusModel.userId)
            ?: throw IllegalArgumentException("사용자를 찾을 수 없습니다: ${adminToggleAccountIsEnabledStatusModel.userId}")

        userInfo.isEnabled = !userInfo.isEnabled
        userInfoRepository.save(userInfo)

        return AdminAccountToggleIsEnabledStatusResDto(
            userId = userInfo.userId,
            isEnabled = userInfo.isEnabled
        )
    }

    @Transactional
    fun execute(
        adminDeleteAccountModel: AdminDeleteAccountModel
    ) {
        val userInfo = userInfoRepository.findByUserId(adminDeleteAccountModel.userId)
            ?: throw IllegalArgumentException("사용자를 찾을 수 없습니다: ${adminDeleteAccountModel.userId}")

        // 사용자 삭제
        userInfoRepository.save(
            userInfo.apply {
                this.isDeleted = true
            }
        )
    }
}