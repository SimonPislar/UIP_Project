package org.Server;

import org.Server.Communications.Sender;
import org.Server.Security.SecurityTools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import org.Server.DBMS.DBController;
import org.Server.DBMS.User;

import java.util.ArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
public class ServerController {

    DBController dbController;
    SecurityTools securityTools;
    private ArrayList<User> usersSignedIn = new ArrayList<>();
    private final Sender sender;

    // This is a thread pool that will be used to schedule asynchronous tasks.
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(4);

    // Auto-wired means that Spring will automatically create an instance of the class and assign it to the variable.
    @Autowired
    public ServerController(DBController dbController, SecurityTools securityTools, Sender sender) {
        this.dbController = dbController;
        this.securityTools = securityTools;
        this.sender = sender;
    }

    /*
        @Brief: This function is used to schedule an asynchronous task.
        @Param: task - The task to be scheduled.
        @Param: delay - The delay in seconds.
    */
    public void scheduleAsyncTask(Runnable task, int delay) {
        scheduler.schedule(task, delay, TimeUnit.SECONDS);
    }

    /*
        @Brief: This function is used to log in a user
        @Param: email - The email of the user to be logged in.
        @Param: password - The password of the user to be logged in.
        @Return: boolean - Returns true if the user is logged in.
     */
    public Boolean login(String email, String password) {
        boolean result = false;
        User user = dbController.getUser(email);
        if (user != null) {
            if (securityTools.comparePasswords(password, user.getPassword())) {
                System.out.println("User " + user.getUsername() + " logged in.");
                result = true;
            } else {
                System.out.println("Invalid credentials for user " + user.getUsername() + ".");
            }
        }
        if (!usersSignedIn.contains(user)) {
            usersSignedIn.add(user);
        }
        return result;
    }

    /*
        @Brief: this method is used to send a message to all users
        @Param: message - The message to be sent.
     */
    public void messageAllUsers(String message) {
        for (User user : usersSignedIn) {
            try {
                this.sender.sendMessageToUser(user.getEmail(), message);
            } catch (Exception e) {
                System.out.println("Failed to send message to user " + user.getEmail() + ".");
            }
        }
    }

    /*
        @Brief: This function is used to register a user
        @Param: email - The email of the user to be registered.
        @Param: username - The username of the user to be registered.
        @Param: password - The password of the user to be registered.
        @Return: boolean - Returns true if the user is registered.
     */
    public Boolean register(String email, String username, String password) {
        boolean result = false;
        if (email.length() >= 5 && !username.isEmpty() && !password.isEmpty()) {
            if (!dbController.userExists(email)) {
                dbController.storeUser(email, username, securityTools.encrypt(password));
                System.out.println("User " + username + " registered.");
                result = true;
            } else {
                System.out.println("User " + username + " already exists.");
            }
        }
        return result;
    }

    /*
        @Brief: This function is used to get the user by email
        @Param: email - The email of the user to be retrieved.
        @Return: User - Returns the user.
     */
    public User getUser(String email) {
        return dbController.getUser(email);
    }
}
