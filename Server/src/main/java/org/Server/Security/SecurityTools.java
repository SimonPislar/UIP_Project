package org.Server.Security;

import org.springframework.stereotype.Component;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;

@Component
public class SecurityTools {

    Argon2PasswordEncoder argon2PasswordEncoder;

    public SecurityTools() {
        argon2PasswordEncoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8(); // Encode with the default values
    }

    public String encrypt(String password) {
        return this.argon2PasswordEncoder.encode(password);
    }

    public Boolean comparePasswords(String password, String encodedPassword) {
        return this.argon2PasswordEncoder.matches(password, encodedPassword);
    }

}
