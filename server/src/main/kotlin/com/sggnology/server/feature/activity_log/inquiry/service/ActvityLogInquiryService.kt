package com.sggnology.server.feature.activity_log.inquiry.service

import com.sggnology.server.db.sql.repository.ActivityLogInfoRepository
import com.sggnology.server.feature.activity_log.inquiry.data.dto.res.ActivityLogResponseDto
import com.sggnology.server.feature.activity_log.inquiry.data.model.InquireActivityLogModel
import org.springframework.stereotype.Service

@Service
class ActvityLogInquiryService(
    private val activityLogInfoRepository: ActivityLogInfoRepository
) {

    fun execute(
        inquireActivityLogModel: InquireActivityLogModel
    ): List<ActivityLogResponseDto> {
        return activityLogInfoRepository.selectTopNByOrderByCreatedAtDesc(
            limit = inquireActivityLogModel.limit
        ).map {
            ActivityLogResponseDto.Companion.from(it)
        }
    }
}