package com.example.connection_service.Service;

import com.example.connection_service.Entity.person;
import com.example.connection_service.auth.UserContextHolder;
import com.example.connection_service.repository.PersonsRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConnectionService {
    private final PersonsRepo personsRepo;

    public List<person> getFirstDegreeConnections(){
        Long userId= UserContextHolder.getCurrentUserId();
        log.info("getting first degree connections for user with id : {}", userId);

        return personsRepo.getFirstDegreeConnections();
    }


}
