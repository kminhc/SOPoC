package com.example.sopoc.repository;

import com.example.sopoc.domain.Eventsource;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Eventsource entity.
 */
public interface EventsourceRepository extends JpaRepository<Eventsource,Long> {

    @Query("select eventsource from Eventsource eventsource where eventsource.user.login = ?#{principal.username}")
    List<Eventsource> findByUserIsCurrentUser();

}
