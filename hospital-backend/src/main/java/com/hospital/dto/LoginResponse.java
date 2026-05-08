package com.hospital.dto;

public class LoginResponse {
    private String token;
    private String role;
    private Long userId;
    private String name;
    private String email;
    private String message;

    public LoginResponse() {}

    public LoginResponse(String token, String role, Long userId, String name, String email, String message) {
        this.token = token;
        this.role = role;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.message = message;
    }

    public static LoginResponseBuilder builder() {
        return new LoginResponseBuilder();
    }

    public static class LoginResponseBuilder {
        private String token;
        private String role;
        private Long userId;
        private String name;
        private String email;
        private String message;

        public LoginResponseBuilder token(String token) { this.token = token; return this; }
        public LoginResponseBuilder role(String role) { this.role = role; return this; }
        public LoginResponseBuilder userId(Long userId) { this.userId = userId; return this; }
        public LoginResponseBuilder name(String name) { this.name = name; return this; }
        public LoginResponseBuilder email(String email) { this.email = email; return this; }
        public LoginResponseBuilder message(String message) { this.message = message; return this; }
        public LoginResponse build() {
            return new LoginResponse(token, role, userId, name, email, message);
        }
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
