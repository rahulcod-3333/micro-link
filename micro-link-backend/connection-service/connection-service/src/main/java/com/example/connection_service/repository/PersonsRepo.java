package com.example.connection_service.repository;

import com.example.connection_service.Entity.Person;
import org.jspecify.annotations.Nullable;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.neo4j.repository.query.Query;

import java.util.List;
import java.util.Optional;

public interface PersonsRepo extends Neo4jRepository<Person, Long> {
    Optional<Person> getByName(String name);

    @Query("MATCH (personA:Person)-[:CONNECTED_TO]-(personB:Person) " +
            "WHERE personA.userId = $userId " +
            "RETURN personB")
    List<Person> getFirstDegreeConnections(@Param("userId") Long userId);


    @Query("MATCH (me:Person)-[:CONNECTED_TO]-(friend:Person)-[:CONNECTED_TO]-(foaf:Person) " +
            "WHERE me.userId = $userId " +
            "AND NOT (me)-[:CONNECTED_TO]-(foaf) " +
            "AND me <> foaf " +
            "RETURN DISTINCT foaf")
    @Nullable List<Person> getFriendsRecommendation(@Param("userId") Long userId);

    @Query("MATCH (p1:Person)-[r:REQUESTED_TO]->(p2:Person) " +
            "WHERE p1.userId = $senderId AND p2.userId = $receiverId " +
            "RETURN count(r) > 0")
    boolean connectionRequestExists(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);

    @Query("MATCH (p1:Person)-[r:CONNECTED_TO]-(p2:Person) " +
            "WHERE p1.userId = $senderId AND p2.userId = $receiverId " +
            "RETURN count(r) > 0")
    boolean alreadyConnected(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);

    @Query("MERGE (p1:Person {userId: $senderId}) " +
            "MERGE (p2:Person {userId: $receiverId}) " +
            "MERGE (p1)-[:REQUESTED_TO]->(p2)")
    void addConnectionRequest(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);

    @Query("MERGE (p1:Person {userId: $senderId}) " +
            "MERGE (p2:Person {userId: $receiverId}) " +
            "WITH p1, p2 " +
            "MATCH (p1)-[r:REQUESTED_TO]->(p2) " +
            "WHERE p1.userId = $senderId AND p2.userId = $receiverId " +
            "DELETE r " +
            "MERGE (p1)-[:CONNECTED_TO]->(p2)")
    void acceptConnectionRequest(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);

    @Query("MATCH (p1:Person)-[r:REQUESTED_TO]->(p2:Person) " +
            "WHERE p1.userId = $senderId AND p2.userId = $receiverId " +
            "DELETE r")
    void rejectConnectionRequest(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);

    @Query("MATCH (sender:Person)-[:REQUESTED_TO]->(me:Person) " +
            "WHERE me.userId = $userId " +
            "RETURN sender")
    List<Person> getReceivedRequests(@Param("userId") Long userId);

    @Query("MATCH (me:Person)-[:REQUESTED_TO]->(receiver:Person) " +
            "WHERE me.userId = $userId " +
            "RETURN receiver")
    List<Person> getSentRequests(@Param("userId") Long userId);

}
