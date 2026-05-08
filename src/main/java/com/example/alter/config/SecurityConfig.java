package com.example.alter.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/index.html", "/style.css", "/script.js", "/todo/register").permitAll() // Allow registration and static files
                .anyRequest().authenticated() // Secure everything else
            )
            .formLogin(form -> form
                .loginProcessingUrl("/todo/login") 
                .defaultSuccessUrl("/todo", true) // Redirect to /todo after login
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/todo/logout")
                .logoutSuccessUrl("/")
                .permitAll());

        return http.build();
    }
}
