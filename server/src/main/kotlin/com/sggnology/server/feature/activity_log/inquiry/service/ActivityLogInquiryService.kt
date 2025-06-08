package com.sggnology.server.feature.activity_log.inquiry.service

import com.sggnology.server.common.annotation.WithUserInfo
import com.sggnology.server.common.type.RoleType
import com.sggnology.server.common.util.UserInfoContextHolder
import com.sggnology.server.db.sql.repository.ActivityLogInfoRepository
import com.sggnology.server.feature.activity_log.inquiry.data.dto.res.ActivityLogResponseDto
import com.sggnology.server.feature.activity_log.inquiry.data.model.InquireActivityLogModel
import org.springframework.data.domain.PageRequest
import org.springframework.data.web.PagedModel
import org.springframework.stereotype.Service

@Service
class ActivityLogInquiryService(
    private val activityLogInfoRepository: ActivityLogInfoRepository,
) {

    @WithUserInfo
    fun execute(
        inquireActivityLogModel: InquireActivityLogModel
    ): PagedModel<ActivityLogResponseDto> {

        val userInfo = UserInfoContextHolder.getUserInfo()

        // 관리자 권한이 있는 경우 모든 사용자 활동 로그 조회 가능
        if(!userInfo.getRoleList().contains(RoleType.ADMIN.roleName)) {
            // 일반 사용자의 경우 자신의 활동 로그만 조회 가능
            if(inquireActivityLogModel.userId != userInfo.userId) {
                throw IllegalArgumentException("You do not have permission to view this user's activity log.")
            }
        }

        val pageable = PageRequest.of(
            inquireActivityLogModel.page,
            inquireActivityLogModel.size,
        )

        val pagedResult = activityLogInfoRepository.inquire(
            pageable,
            userId = inquireActivityLogModel.userId,
        )
        val formattedResult = pagedResult.map {
            ActivityLogResponseDto.from(it)
        }

        return PagedModel(formattedResult)
    }
}