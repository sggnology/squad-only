package com.sggnology.server.endpoint.view

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping

@Controller
class SpaController {
    /**
     * API 및 정적 리소스 요청을 제외한 모든 GET 요청을 index.html로 포워딩합니다.
     * Spring의 기본 핸들러 매핑 순서에 따라 정적 리소스 핸들러와 API 컨트롤러가
     * 이 컨트롤러보다 먼저 요청을 처리합니다.
     *
     * @return "forward:/index.html" 뷰 이름
     */
    @GetMapping(value = ["/", "/{path:^(?!api|assets|swagger-ui)[^.]*}/**"])
    fun forwardToIndex(): String {
        return "forward:/index.html"
    }
}