package com.canbe.utils;

import com.aliyun.oss.ClientException;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.OSSException;

import java.io.InputStream;

/**
 * 阿里云OSS工具类
 * Aliyun OSS Utility Class
 * 
 * 提供文件上传到阿里云OSS存储服务的功能
 * Provides functionality to upload files to Aliyun OSS storage service
 */
public class AliOssUtil {
    // OSS访问端点 - OSS endpoint
    private static final String ENDPOINT = "https://oss-cn-beijing.aliyuncs.com";
    // 访问密钥ID - Access key ID
    private static final String ACCESS_KEY_ID = "LTAI5tQ8e13igWZUMTjMEEQV";
    // 私密访问密钥 - Secret access key
    private static final String SECRET_ACCESS_KEY = "MffMJoM24sc59SEBEJQDb0cfBVOAC9";
    // 存储空间名称 - Bucket name
    private static final String BUCKET_NAME = "big-event-gwd";

    /**
     * 上传文件到阿里云OSS并返回公网访问地址
     * Upload file to Aliyun OSS and return public access URL
     * 
     * @param objectName 对象名称（文件路径及名称）Object name (file path and name)
     * @param inputStream 文件输入流 File input stream
     * @return String 文件的公网访问地址 Public access URL of the file
     */
    public static String uploadFile(String objectName, InputStream inputStream){
        // 创建OSSClient实例 - Create OSSClient instance
        OSS ossClient = new OSSClientBuilder().build(ENDPOINT,ACCESS_KEY_ID,SECRET_ACCESS_KEY);
        // 公网访问地址 - Public access URL
        String url = "";
        try {
            // 创建存储空间 - Create bucket
            ossClient.createBucket(BUCKET_NAME);
            // 上传文件 - Upload file
            ossClient.putObject(BUCKET_NAME, objectName, inputStream);
            // 构造公网访问地址 - Construct public access URL
            url = "https://"+BUCKET_NAME+"."+ENDPOINT.substring(ENDPOINT.lastIndexOf("/")+1)+"/"+objectName;
        } catch (OSSException oe) {
            // 捕获OSS异常 - Catch OSS exception
            System.out.println("Caught an OSSException, which means your request made it to OSS, "
                    + "but was rejected with an error response for some reason.");
            System.out.println("Error Message:" + oe.getErrorMessage());
            System.out.println("Error Code:" + oe.getErrorCode());
            System.out.println("Request ID:" + oe.getRequestId());
            System.out.println("Host ID:" + oe.getHostId());
        } catch (ClientException ce) {
            // 捕获客户端异常 - Catch client exception
            System.out.println("Caught an ClientException, which means the client encountered "
                    + "a serious internal problem while trying to communicate with OSS, "
                    + "such as not being able to access the network.");
            System.out.println("Error Message:" + ce.getMessage());
        } finally {
            // 关闭OSSClient连接 - Close OSSClient connection
            if (ossClient != null) {
                ossClient.shutdown();
            }
        }
        return url;
    }
}