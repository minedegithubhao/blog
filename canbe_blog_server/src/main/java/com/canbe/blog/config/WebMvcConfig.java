package com.canbe.blog.config;

import com.canbe.blog.security.AuthInterceptor;
import java.nio.file.Path;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final AuthInterceptor authInterceptor;
    private final String storagePath;

    public WebMvcConfig(AuthInterceptor authInterceptor, @Value("${blog.file.storage-path:storage/uploads}") String storagePath) {
        this.authInterceptor = authInterceptor;
        this.storagePath = storagePath;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)
            .addPathPatterns("/api/v1/**")
            .excludePathPatterns(
                "/api/v1/auth/login",
                "/api/v1/auth/register",
                "/api/v1/public/**"
            );
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String fileLocation = Path.of(storagePath).toAbsolutePath().normalize().toUri().toString();
        registry.addResourceHandler("/uploads/**")
            .addResourceLocations(fileLocation.endsWith("/") ? fileLocation : fileLocation + "/");
    }
}
