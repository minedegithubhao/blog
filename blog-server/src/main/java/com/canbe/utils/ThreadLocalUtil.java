package com.canbe.utils;

/**
 * ThreadLocal 工具类
 * ThreadLocal Utility Class
 * 
 * 提供基于ThreadLocal的线程本地变量存储功能
 * Provides thread-local variable storage functionality based on ThreadLocal
 */
@SuppressWarnings("all")
public class ThreadLocalUtil {
    //提供ThreadLocal对象, 用于存储线程本地变量
    //Provide ThreadLocal object for storing thread-local variables
    private static final ThreadLocal THREAD_LOCAL = new ThreadLocal();

    //根据键获取值
    //Get value by key
    /**
     * 获取当前线程中存储的值
     * Get the value stored in the current thread
     * 
     * @param <T> 泛型类型 Generic type
     * @return T 返回存储的值 Return the stored value
     */
    public static <T> T get(){
        return (T) THREAD_LOCAL.get();
    }
	
    //存储键值对
    //Store key-value pair
    /**
     * 在当前线程中存储值
     * Store value in the current thread
     * 
     * @param value 要存储的值 The value to store
     */
    public static void set(Object value){
        THREAD_LOCAL.set(value);
    }


    //清除ThreadLocal 防止内存泄漏
    //Clear ThreadLocal to prevent memory leaks
    /**
     * 清除当前线程中的ThreadLocal值，防止内存泄漏
     * Remove the ThreadLocal value in the current thread to prevent memory leaks
     */
    public static void remove(){
        THREAD_LOCAL.remove();
    }
}