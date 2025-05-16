plugins {
    kotlin("jvm") version "1.9.25"

    kotlin("kapt") version "1.9.25" // !!! Required for annotation processing in Kotlin !!!
    kotlin("plugin.jpa") version "1.9.25"
    kotlin("plugin.spring") version "1.9.25"

    id("org.springframework.boot") version "3.4.5"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "com.sggnology"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    mavenCentral()
}

val queryDslVersion = "5.0.0" // Use a compatible QueryDSL version

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-jdbc")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")

    // QueryDSL Dependencies
    implementation("com.querydsl:querydsl-jpa:$queryDslVersion:jakarta") // Use jakarta for Spring Boot 3+
    implementation("com.querydsl:querydsl-core:$queryDslVersion")

    // !!! Annotation Processor for QueryDSL !!!
    kapt("com.querydsl:querydsl-apt:$queryDslVersion:jakarta") // Use jakarta for Spring Boot 3+

    // springdoc-openapi 의존성 추가 (Swagger UI 포함)
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.8")

    developmentOnly("org.springframework.boot:spring-boot-devtools")
    developmentOnly("org.springframework.boot:spring-boot-docker-compose")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    runtimeOnly("org.postgresql:postgresql")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict")
    }
}

allOpen {
    annotation("jakarta.persistence.Entity")
    annotation("jakarta.persistence.MappedSuperclass")
    annotation("jakarta.persistence.Embeddable")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

// build.gradle.kts 예시
tasks.register<Copy>("copyReactBuild") {
    from("../client/dist") // frontend 프로젝트의 위치
    into("src/main/resources/static")
}

tasks.named("processResources") {
    dependsOn("copyReactBuild")
}
