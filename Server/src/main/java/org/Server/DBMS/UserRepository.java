package org.Server.DBMS;

import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete
// This interface will be used to communicate with the database.
// The type of the entity and the primary key are specified as type arguments.
// The CrudRepository interface provides methods for CRUD operations.
// The findByEmail method is used to retrieve a user by email.

public interface UserRepository extends CrudRepository<User, Integer> {
    Optional<User> findByEmail(String email);
}
