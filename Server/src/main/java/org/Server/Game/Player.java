package org.Server.Game;

import java.util.UUID;

public class Player {

    final private String name;
    private int points;
    final private int ID;
    private final String IP;

    public Player(String name, int ID, String IP) {
        this.name = name;
        this.points = 0;
        this.ID = ID;
        this.IP = IP;
    }

    /*
        @Brief: This function is used to get the name of the player.
        @Return: String - Returns the name of the player.
     */
    public String getName() {
        return this.name;
    }

    /*
        @Brief: This function is used to get the points of the player.
        @Return: int - Returns the points of the player.
     */
    public int getPoints() {
        return this.points;
    }

    /*
        @Brief: This function is used to get the ID of the player.
        @Return: int - Returns the ID of the player.
     */
    public int getID() {
        return this.ID;
    }

    /*
        @Brief: This function is used to receive a point.
        @Return: void - Returns nothing.
     */
    public void receivePoint() {
        this.points++;
    }

    /*
        @Brief: This function is used to reset the points of the player.
        @Return: void - Returns nothing.
     */
    public void resetPoints() {
        this.points = 0;
    }

    /*
        @Brief: This function is used to get the IP of the player.
        @Return: String - Returns the IP of the player.
     */
    public String getIP() {
        return this.IP;
    }
}
