package com.moe.socialnetwork.config;

import org.springframework.beans.factory.annotation.Value;

/**
 * Web MVC configuration for the application, including CORS settings.
 */

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * Author: nhutnm379
 */
@Configuration
public class CorsConfig {
	@Value("${cors.allowed.origin}")
	private String allowedOrigin;

	@Bean
	public CorsFilter corsFilter() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();

		config.setAllowCredentials(true);
		config.addAllowedOrigin(allowedOrigin); // Đảm bảo đúng URL
		config.addAllowedOrigin("http://172.22.64.1:3000");
		config.addAllowedHeader("*");
		config.addExposedHeader("*");
		config.addAllowedMethod("*");

		source.registerCorsConfiguration("/**", config);
		return new CorsFilter(source);
	}
}
