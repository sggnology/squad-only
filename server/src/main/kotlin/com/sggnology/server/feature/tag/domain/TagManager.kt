package com.sggnology.server.feature.tag.domain

import com.sggnology.server.db.sql.entity.TagInfo
import com.sggnology.server.db.sql.repository.TagInfoRepository
import com.sggnology.server.feature.tag.data.dto.TagRegistrationReqDto
import com.sggnology.server.feature.tag.data.model.TagRegistrationModel

class TagManager(
    private val tagInfoRepository: TagInfoRepository
) {

    fun command(registrationReqDto: TagRegistrationReqDto): TagRegistrationModel {

        val tagNames = registrationReqDto.tagNames

        val existTagInfos = tagInfoRepository.findByNameIn(tagNames)
        val newTagInfos = mutableListOf<TagInfo>()

        if(existTagInfos.isEmpty()){
            newTagInfos.addAll(
                tagNames.map {
                    createTagInfo(it)
                }
            )
        }
        else {
            newTagInfos.addAll(
                tagNames.filter { tagName -> existTagInfos.none {it.name == tagName} }
                    .map { createTagInfo(it) }
            )
        }

        return TagRegistrationModel(
            prevTagInfos = existTagInfos,
            newTagInfos = tagInfoRepository.saveAll(newTagInfos),
            combinedTagInfos = existTagInfos + newTagInfos
        )
    }

    private fun createTagInfo(tagName: String): TagInfo{
        return TagInfo(
            name = tagName
        )
    }
}