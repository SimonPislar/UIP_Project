package org.Server.Communications;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Sender {

    @Autowired
    public Sender() {

    }

    /*
        @Brief: This function notifies the client that drawing has ended
        @Return: void - Returns nothing.
     */
    public void drawTimeIsUp() {

    }

    /*
        @Brief: This function notifies the client that the guess round has started
        @Return: void - Returns nothing.
     */
    public void guessRoundStart() {

    }

    /*
        @Brief: This function notifies the client that the guess round has ended
        @Return: void - Returns nothing.
     */
    public void guessRoundEnd() {

    }

    /*
        @Brief: This function notifies the client that the drawing round has started
        @Return: void - Returns nothing.
     */
    public void drawRoundStart() {

    }

    /*
        @Brief: This function notifies the client that the drawing round has ended
        @Return: void - Returns nothing.
     */
    public void drawRoundEnd() {

    }

    /*
        @Brief: This function notifies the client that the game has unexpectedly ended
        @Param: message - The message to be sent to the client.
        @Return: void - Returns nothing.
    */
    public void cancelGame(String message) {

    }



}
