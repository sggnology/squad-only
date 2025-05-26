//package com.sggnology.server.security
//
//import com.sggnology.server.db.sql.entity.UserInfo
//import org.springframework.security.core.GrantedAuthority
//import org.springframework.security.core.authority.SimpleGrantedAuthority
//import org.springframework.security.core.userdetails.UserDetails
//
//class UserInfoUserDetails(private val userInfo: UserInfo) : UserDetails {
//
//    override fun getAuthorities(): Collection<GrantedAuthority> {
//        // DB에 저장된 역할 정보를 Spring Security의 권한으로 변환
//        return userInfo.getRoleList().map { SimpleGrantedAuthority(it) }
//    }
//
//    override fun getPassword(): String {
//        return userInfo.userPw
//    }
//
//    override fun getUsername(): String {
//        return userInfo.userId
//    }
//
//    override fun isAccountNonExpired(): Boolean {
//        return !userInfo.isDeleted
//    }
//
//    override fun isAccountNonLocked(): Boolean {
//        return !userInfo.isDeleted
//    }
//
//    override fun isCredentialsNonExpired(): Boolean {
//        return true
//    }
//
//    override fun isEnabled(): Boolean {
//        return !userInfo.isDeleted
//    }
//}
