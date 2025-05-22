package com.sggnology.server.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = "file")
class FileProperties {
    lateinit var tempDir: String
    lateinit var storageDir: String
}