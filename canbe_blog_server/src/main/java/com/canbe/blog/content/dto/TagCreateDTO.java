package com.canbe.blog.content.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TagCreateDTO {

    @NotBlank
    @Size(max = 64)
    private String name;

    @NotBlank
    @Size(max = 64)
    private String slug;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }
}
