package org.Server.Security;

import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
public class SecurityTools {

    public SecurityTools() {

    }

    public UUID generateID() {
        UUID id = UUID.randomUUID();
        return id;
    }

}
