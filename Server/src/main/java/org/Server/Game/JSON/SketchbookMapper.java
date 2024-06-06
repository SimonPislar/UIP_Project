package org.Server.Game.JSON;

import org.Server.Game.SketchBook;
import org.Server.Game.Drawing;

import java.util.List;
import java.util.stream.Collectors;

public class SketchbookMapper {

    public static SketchbookDTO toDTO(SketchBook sketchBook) {
        SketchbookDTO sketchbookDTO = new SketchbookDTO();
        sketchbookDTO.setOwnersEmail(sketchBook.getOwnersEmail());
        sketchbookDTO.setOriginalWord(sketchBook.getOriginalWord());
        List<DrawingDTO> drawingDTOs = sketchBook.getDrawings().stream()
                .map(SketchbookMapper::toDTO)
                .collect(Collectors.toList());
        sketchbookDTO.setDrawings(drawingDTOs);
        return sketchbookDTO;
    }

    private static DrawingDTO toDTO(Drawing drawing) {
        DrawingDTO drawingDTO = new DrawingDTO();
        drawingDTO.setPainterEmail(drawing.getPainterEmail());
        drawingDTO.setDrawing(drawing.getDrawingData());
        drawingDTO.setGuesserEmail(drawing.getGuesserEmail());
        drawingDTO.setGuess(drawing.getGuess());
        return drawingDTO;
    }
}
