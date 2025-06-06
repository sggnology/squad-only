package com.sggnology.server.common.util

object ClientIPHolder {
    private val clientIp: ThreadLocal<String?> = ThreadLocal<String?>()

    fun set(ip: String?) {
        clientIp.set(ip)
    }

    fun get(): String? {
        return clientIp.get()
    }

    fun clear() {
        clientIp.remove()
    }
}