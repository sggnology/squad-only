package com.sggnology.server.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = "app.admin")
class AdminProperties {
    var username: String = "admin" // val 로 설정하면, setter 가 없어 property overwrite 가 되지 않는다.
    var password: String = "1234"
    var name: String = "squad-only"
}