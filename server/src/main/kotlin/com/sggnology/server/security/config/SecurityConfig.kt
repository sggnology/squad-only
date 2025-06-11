package com.sggnology.server.security.config

import com.sggnology.server.db.sql.repository.UserInfoRepository
import com.sggnology.server.security.JwtTokenProvider
import com.sggnology.server.security.filter.JwtAuthenticationFilter
import com.sggnology.server.security.handler.JwtAccessDeniedHandler
import com.sggnology.server.security.handler.JwtAuthenticationEntryPoint
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val jwtTokenProvider: JwtTokenProvider,
    private val jwtAuthenticationEntryPoint: JwtAuthenticationEntryPoint,
    private val jwtAccessDeniedHandler: JwtAccessDeniedHandler,
    private val userInfoRepository: UserInfoRepository
) {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .cors {}
            .exceptionHandling {
                it.authenticationEntryPoint(jwtAuthenticationEntryPoint)
                it.accessDeniedHandler(jwtAccessDeniedHandler)
            }
            .sessionManagement {
                it.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }
            .authorizeHttpRequests { auth ->
                auth
                    // 콘텐츠 조회 엔드포인트는 인증 없이 접근 가능
                    .requestMatchers(HttpMethod.GET, "/api/v1/content").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/v1/content/*").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/v1/tag").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/v1/comment/{contentIdx}").permitAll()

                    // 콘텐츠 조회시 사용되는 파일 조회 접근 가능
                    .requestMatchers(HttpMethod.GET, "/api/v1/file/*").permitAll()

                    // 사이트 정보 조회시 접근 가능
                    .requestMatchers(HttpMethod.GET, "/api/v1/site").permitAll()

                    // 정적 리소스 허용
                    .requestMatchers("/", "/static/**", "/assets/**").permitAll()

                    // Swagger 허용
                    .requestMatchers("/swagger-ui/**").permitAll()

                    // 로그인, 회원가입 등의 인증 관련 엔드포인트 허용
                    .requestMatchers("/api/v1/auth/**").permitAll()

                    // 관리자 권한 필요
                    .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")

                    // 그 외 /api 경로는 인증 필요
                    .requestMatchers("/api/**").authenticated()

                    // 나머지 요청은 모두 허용
                    .anyRequest().permitAll()
            }
            .addFilterBefore(
                JwtAuthenticationFilter(jwtTokenProvider, userInfoRepository),
                UsernamePasswordAuthenticationFilter::class.java
            )

        return http.build()
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }
}