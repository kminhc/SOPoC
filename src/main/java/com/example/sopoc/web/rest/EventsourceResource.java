package com.example.sopoc.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.example.sopoc.domain.Eventsource;
import com.example.sopoc.repository.EventsourceRepository;
import com.example.sopoc.web.rest.util.HeaderUtil;
import com.example.sopoc.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Eventsource.
 */
@RestController
@RequestMapping("/api")
public class EventsourceResource {

    private final Logger log = LoggerFactory.getLogger(EventsourceResource.class);
        
    @Inject
    private EventsourceRepository eventsourceRepository;
    
    /**
     * POST  /eventsources : Create a new eventsource.
     *
     * @param eventsource the eventsource to create
     * @return the ResponseEntity with status 201 (Created) and with body the new eventsource, or with status 400 (Bad Request) if the eventsource has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/eventsources",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Eventsource> createEventsource(@Valid @RequestBody Eventsource eventsource) throws URISyntaxException {
        log.debug("REST request to save Eventsource : {}", eventsource);
        if (eventsource.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("eventsource", "idexists", "A new eventsource cannot already have an ID")).body(null);
        }
        Eventsource result = eventsourceRepository.save(eventsource);
        return ResponseEntity.created(new URI("/api/eventsources/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("eventsource", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /eventsources : Updates an existing eventsource.
     *
     * @param eventsource the eventsource to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated eventsource,
     * or with status 400 (Bad Request) if the eventsource is not valid,
     * or with status 500 (Internal Server Error) if the eventsource couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/eventsources",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Eventsource> updateEventsource(@Valid @RequestBody Eventsource eventsource) throws URISyntaxException {
        log.debug("REST request to update Eventsource : {}", eventsource);
        if (eventsource.getId() == null) {
            return createEventsource(eventsource);
        }
        Eventsource result = eventsourceRepository.save(eventsource);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("eventsource", eventsource.getId().toString()))
            .body(result);
    }

    /**
     * GET  /eventsources : get all the eventsources.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of eventsources in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/eventsources",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Eventsource>> getAllEventsources(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Eventsources");
        Page<Eventsource> page = eventsourceRepository.findAll(pageable); 
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/eventsources");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /eventsources/:id : get the "id" eventsource.
     *
     * @param id the id of the eventsource to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the eventsource, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/eventsources/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Eventsource> getEventsource(@PathVariable Long id) {
        log.debug("REST request to get Eventsource : {}", id);
        Eventsource eventsource = eventsourceRepository.findOne(id);
        return Optional.ofNullable(eventsource)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /eventsources/:id : delete the "id" eventsource.
     *
     * @param id the id of the eventsource to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/eventsources/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteEventsource(@PathVariable Long id) {
        log.debug("REST request to delete Eventsource : {}", id);
        eventsourceRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("eventsource", id.toString())).build();
    }

}
