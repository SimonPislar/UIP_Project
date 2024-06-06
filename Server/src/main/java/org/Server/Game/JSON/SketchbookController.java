package org.Server.Game.JSON;

import org.Server.Game.SketchBook;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class SketchbookController {

    private final List<SketchBook> sketchBooks;

    public SketchbookController(List<SketchBook> sketchBooks) {
        this.sketchBooks = sketchBooks;
    }

    @GetMapping("/sketchbooks")
    public List<SketchbookDTO> getSketchbooks() {
        return sketchBooks.stream()
                .map(SketchbookMapper::toDTO)
                .collect(Collectors.toList());
    }
}
