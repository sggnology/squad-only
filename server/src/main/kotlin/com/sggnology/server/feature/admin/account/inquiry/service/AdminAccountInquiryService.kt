package com.sggnology.server.feature.admin.account.inquiry.service

import com.sggnology.server.db.sql.repository.UserInfoRepository
import com.sggnology.server.feature.admin.account.inquiry.data.dto.res.AdminAccountInquiryResDto
import com.sggnology.server.feature.admin.account.inquiry.data.model.AdminInquireAccountModel
import org.springframework.data.domain.PageRequest
import org.springframework.data.web.PagedModel
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AdminAccountInquiryService(
    private val userInfoRepository: UserInfoRepository,
) {

    @Transactional(readOnly = true)
    fun execute(
        adminInquireAccountModel: AdminInquireAccountModel
    ): PagedModel<AdminAccountInquiryResDto> {

        val pageable = PageRequest.of(
            adminInquireAccountModel.page,
            adminInquireAccountModel.size
        )

        val result = userInfoRepository.inquire(pageable)
        val formattedResult = result.map {
            AdminAccountInquiryResDto.fromUserInfo(it)
        }

        return PagedModel(formattedResult)
    }
}