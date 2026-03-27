package com.example.connection_service.repository;

import com.example.connection_service.Entity.person;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

import java.util.List;
import java.util.Optional;

public interface PersonsRepo extends Neo4jRepository<person, Long> {
    Optional<person> getByName(String name);

    @Query("MATCH (personA:person) -[:CONNECTED_TO]- (personB:person)"+
    "WHERE personA.userId = $userId"+"RETURN personB")
    List<person> getFirstDegreeConnections();

}
