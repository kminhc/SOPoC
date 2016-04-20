package com.example.sopoc.repository;

import com.example.sopoc.domain.Event;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Event entity.
 */
public interface EventRepository extends JpaRepository<Event,Long> {

}
