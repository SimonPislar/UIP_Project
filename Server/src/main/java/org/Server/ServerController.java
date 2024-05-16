package org.Server;

import org.Server.Security.SecurityTools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import org.Server.DBMS.DBController;
import org.Server.DBMS.User;

@Component
public class ServerController {

    DBController dbController;
    SecurityTools securityTools;

    @Autowired
    public ServerController(DBController dbController, SecurityTools securityTools) {
        this.dbController = dbController;
        this.securityTools = securityTools;
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
            }
        }
        return result;
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
        if (dbController.getUser(email) == null) {
            dbController.storeUser(email, username, securityTools.encrypt(password));
            result = true;
        }
        return result;
    }

}
