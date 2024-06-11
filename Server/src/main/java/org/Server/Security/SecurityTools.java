package org.Server.Security;

import org.springframework.stereotype.Component;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;

// This class provides methods for encrypting and comparing passwords.
@Component
public class SecurityTools {

    Argon2PasswordEncoder argon2PasswordEncoder;

    public SecurityTools() {
        argon2PasswordEncoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8(); // Encode with the default values
    }

    // Encrypts a password using Argon2
    public String encrypt(String password) {
        return this.argon2PasswordEncoder.encode(password);
    }

    // Compares a password with an encoded password
    public Boolean comparePasswords(String password, String encodedPassword) {
        return this.argon2PasswordEncoder.matches(password, encodedPassword);
    }

}
