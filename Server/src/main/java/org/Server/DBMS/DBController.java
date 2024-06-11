package org.Server.DBMS;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

// This class is responsible for interacting with the database.
@Component
public class DBController {

    private final UserRepository userRepository;

    // Auto-wired means that Spring will automatically create an instance of UserRepository and pass it to the constructor.
    @Autowired
    public DBController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /*
        @Brief: Save a user to the database.
        @Param: email - The email of the user.
        @Param: username - The username of the user.
        @Param: password - The password of the user.
        @Return: void - Returns nothing.
     */
    public void storeUser(String email, String username, String password) {
        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(password);
        this.userRepository.save(user);
        System.out.println("User " + username + " saved to database.");
    }

    /*
        @Brief: Delete a user from the database.
        @Param: email - The email of the user to be deleted.
        @Return: void - Returns nothing.
     */
    public void deleteUser(String email) {
        this.userRepository.findByEmail(email).ifPresent(this.userRepository::delete);
    }

    /*
        @Brief: Update a user in the database.
        @Param: email - The email of the user to be updated.
        @Param: username - The new username of the user.
        @Param: password - The new password of the user.
        @Return: void - Returns nothing.
     */
    public void updateUser(String email, String username, String password) {
        this.userRepository.findByEmail(email).ifPresent(user -> {
            if (username != null) user.setUsername(username);
            if (password != null) user.setPassword(password);
            this.userRepository.save(user);
        });
    }

    /*
        @Brief: Get a user from the database.
        @Param: email - The email of the user to be retrieved.
        @Return: User - Returns the user with the given email.
     */
    public User getUser(String email) {
        return this.userRepository.findByEmail(email).orElse(null);
    }

    /*
        @Brief: Check if a user exists in the database.
        @Param: email - The email of the user to be checked.
        @Return: boolean - Returns true if the user exists in the database.
     */
    public boolean userExists(String email) {
        return this.userRepository.findByEmail(email).isPresent();
    }
}
