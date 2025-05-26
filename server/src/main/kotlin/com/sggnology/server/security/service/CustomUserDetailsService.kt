//package com.sggnology.server.security.service
//
//import com.sggnology.server.db.sql.repository.UserInfoRepository
//import com.sggnology.server.security.UserInfoUserDetails
//
//import org.springframework.security.core.userdetails.UserDetails
//import org.springframework.security.core.userdetails.UserDetailsService
//import org.springframework.security.core.userdetails.UsernameNotFoundException
//import org.springframework.stereotype.Service
//import org.springframework.transaction.annotation.Transactional
//
//@Service
//class CustomUserDetailsService(
//    private val userInfoRepository: UserInfoRepository
//) : UserDetailsService {
//
//    @Transactional(readOnly = true)
//    override fun loadUserByUsername(username: String): UserDetails {
//        val userInfo = userInfoRepository.findByUserId(username)
//            ?: throw UsernameNotFoundException("사용자를 찾을 수 없습니다: $username")
//
//        return UserInfoUserDetails(userInfo)
//    }
//}
