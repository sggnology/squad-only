package com.sggnology.server.feature.activity_log.registration.service

import com.sggnology.server.db.sql.repository.ActivityLogInfoRepository
import com.sggnology.server.feature.activity_log.registration.data.model.RegisterActivityLogModel
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ActivityLogRegistrationService(
    private val activityLogInfoRepository: ActivityLogInfoRepository
) {
    @Transactional
    fun execute(registerActivityLogModel: RegisterActivityLogModel) {
        activityLogInfoRepository.save(
            registerActivityLogModel.toActivityLogInfo()
        )
    }
}