package org.Server.Game.JSON;

import java.util.List;

// This class is responsible for representing a sketchbook when it is sent to the client.
public class SketchbookDTO {
    private String ownersEmail;
    private String originalWord;
    private List<DrawingDTO> drawings;

    // Getters and Setters

    public String getOwnersEmail() {
        return ownersEmail;
    }

    public void setOwnersEmail(String ownersEmail) {
        this.ownersEmail = ownersEmail;
    }

    public String getOriginalWord() {
        return originalWord;
    }

    public void setOriginalWord(String originalWord) {
        this.originalWord = originalWord;
    }

    public List<DrawingDTO> getDrawings() {
        return drawings;
    }

    public void setDrawings(List<DrawingDTO> drawings) {
        this.drawings = drawings;
    }
}
