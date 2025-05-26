package com.sggnology.server.feature.auth.data.dto.req

data class AuthIdentifyMeModel(
    val accessToken: String? = null,
//    val refreshToken: String? = null
) {
    companion object{
        fun fromAuthorizationHeader(accessToken: String?): AuthIdentifyMeModel {
            return AuthIdentifyMeModel(
                accessToken = accessToken
            )
        }
    }
}
