package com.sggnology.server.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = "file")
class FileProperties {
    @Value("\${file.temp-dir}")
    lateinit var tempDir: String
    lateinit var storageDir: String
}