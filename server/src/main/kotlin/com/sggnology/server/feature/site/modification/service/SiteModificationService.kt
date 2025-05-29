package com.sggnology.server.feature.site.modification.service

import com.sggnology.server.common.constants.SiteConfig
import com.sggnology.server.db.sql.repository.ConfigInfoRepository
import com.sggnology.server.feature.site.modification.data.dto.res.SiteModificationResDto
import com.sggnology.server.feature.site.modification.data.model.SiteModifyModel
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class SiteModificationService(
    private val configInfoRepository: ConfigInfoRepository
) {

    @Transactional
    fun execute(
        siteModifyModel: SiteModifyModel
    ): SiteModificationResDto {

        val configInfo = configInfoRepository.findByKey(SiteConfig.SITE_NAME_KEY)
            ?: throw IllegalArgumentException("Site configuration not found")

        configInfo.value = siteModifyModel.name

        return SiteModificationResDto(
            name = configInfo.value,
        ).also {
            configInfoRepository.save(configInfo)
        }
    }
}