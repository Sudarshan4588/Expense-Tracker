package com.expense.expense_tracker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable() // ✅ Needed for PUT/DELETE via Postman or JS
                .authorizeHttpRequests()
                .anyRequest().authenticated()
                .and()
                .formLogin(); // ✅ Enables default Spring Security login page

        return http.build();
    }
}
