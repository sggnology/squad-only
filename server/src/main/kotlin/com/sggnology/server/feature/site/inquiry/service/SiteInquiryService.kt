package com.sggnology.server.feature.site.inquiry.service

import com.sggnology.server.constants.SiteConfig
import com.sggnology.server.db.sql.repository.ConfigInfoRepository
import com.sggnology.server.feature.site.inquiry.data.dto.res.SiteInquiryResDto
import org.springframework.stereotype.Service

@Service
class SiteInquiryService(
    private val configInfoRepository: ConfigInfoRepository
) {

    fun execute(): SiteInquiryResDto {
        val configInfo = configInfoRepository.findByKey(SiteConfig.SITE_NAME_KEY)

        return SiteInquiryResDto(
            name = configInfo?.value ?: SiteConfig.SITE_NAME_VALUE_DEFAULT,
        )
    }
}