package com.sggnology.server.service

import jakarta.annotation.PostConstruct
import org.springframework.stereotype.Service
import java.security.KeyPair
import java.security.KeyPairGenerator
import java.security.PrivateKey
import java.security.PublicKey
import java.util.*
import javax.crypto.Cipher

@Service
class CryptoService {
    
    private lateinit var keyPair: KeyPair
    private lateinit var publicKey: PublicKey  
    private lateinit var privateKey: PrivateKey
    
    @PostConstruct
    fun init() {
        generateKeyPair()
    }
    
    private fun generateKeyPair() {
        val keyPairGenerator = KeyPairGenerator.getInstance("RSA")
        keyPairGenerator.initialize(2048)
        keyPair = keyPairGenerator.generateKeyPair()
        publicKey = keyPair.public
        privateKey = keyPair.private
    }
    
    fun getPublicKey(): String {
        val encoded = Base64.getEncoder().encodeToString(publicKey.encoded)
        return "-----BEGIN PUBLIC KEY-----\n$encoded\n-----END PUBLIC KEY-----"
    }
    
    fun decryptPassword(encryptedPassword: String): String {
        try {
            val cipher = Cipher.getInstance("RSA")
            cipher.init(Cipher.DECRYPT_MODE, privateKey)
            
            val encryptedBytes = Base64.getDecoder().decode(encryptedPassword)
            val decryptedBytes = cipher.doFinal(encryptedBytes)
            
            return String(decryptedBytes)
        } catch (e: Exception) {
            throw RuntimeException("비밀번호 복호화 실패: ${e.message}", e)
        }
    }
}
