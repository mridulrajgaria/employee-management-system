package com.ems.config;

import com.ems.security.JwtAuthFilter;
import com.ems.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Security configuration:
 *  - Stateless (JWT, no sessions)
 *  - Role-based endpoint protection
 *  - BCrypt password hashing
 *
 * Interview key points:
 *  1. STATELESS sessions → JWT stored client-side
 *  2. @EnableMethodSecurity → @PreAuthorize annotations in controllers
 *  3. BCrypt with default strength 10
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity           // Enables @PreAuthorize on methods
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtAuthFilter jwtAuthFilter;

    // Endpoints open to everyone (no token needed)
    private static final String[] PUBLIC_URLS = {
            "/",
            "/index.html",
            "/css/**",
            "/js/**",
            "/favicon.ico",
            "/api/auth/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/api-docs/**",
            "/v3/api-docs/**",
            "/h2-console/**"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)          // Disabled for stateless REST API
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(PUBLIC_URLS).permitAll()

                // Only ADMIN can create/update/delete employees and departments
                .requestMatchers(HttpMethod.POST, "/api/employees/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/employees/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/employees/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/departments/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/departments/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/departments/**").hasRole("ADMIN")

                // Both ADMIN and EMPLOYEE can read
                .requestMatchers(HttpMethod.GET, "/api/employees/**").hasAnyRole("ADMIN", "EMPLOYEE")
                .requestMatchers(HttpMethod.GET, "/api/departments/**").hasAnyRole("ADMIN", "EMPLOYEE")

                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();  // Default strength = 10 rounds
    }
}
