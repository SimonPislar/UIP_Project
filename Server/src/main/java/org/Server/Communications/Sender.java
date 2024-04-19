package org.Server.Communications;

import org.springframework.stereotype.Component;

@Component
public class Sender {

    /*
        @Brief: This function notifies the client that drawing has ended
        @Return: void - Returns nothing.
     */
    public void drawTimeIsUp() {

    }

    /*
        @Brief: This function notifies the client that the game has unexpectedly ended
        @Param: message - The message to be sent to the client.
        @Return: void - Returns nothing.
    */
    public void cancelGame(String message) {

    }

    /*
        @Brief: This function notifies the client that the game has ended
        @Return: void - Returns nothing.
    */
    public void notifyGameStart() {

    }



}
