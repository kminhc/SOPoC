package com.example.sopoc.web.rest;

import com.example.sopoc.SoPoCApp;
import com.example.sopoc.domain.Event;
import com.example.sopoc.repository.EventRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.Matchers.hasItem;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the EventResource REST controller.
 *
 * @see EventResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = SoPoCApp.class)
@WebAppConfiguration
@IntegrationTest
public class EventResourceIntTest {

    private static final String DEFAULT_TITLE = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB";

    private static final LocalDate DEFAULT_START = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END = LocalDate.now(ZoneId.systemDefault());

    private static final Boolean DEFAULT_ALL_DAY = false;
    private static final Boolean UPDATED_ALL_DAY = true;

    @Inject
    private EventRepository eventRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restEventMockMvc;

    private Event event;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        EventResource eventResource = new EventResource();
        ReflectionTestUtils.setField(eventResource, "eventRepository", eventRepository);
        this.restEventMockMvc = MockMvcBuilders.standaloneSetup(eventResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        event = new Event();
        event.setTitle(DEFAULT_TITLE);
        event.setStart(DEFAULT_START);
        event.setEnd(DEFAULT_END);
        event.setAllDay(DEFAULT_ALL_DAY);
    }

    @Test
    @Transactional
    public void createEvent() throws Exception {
        int databaseSizeBeforeCreate = eventRepository.findAll().size();

        // Create the Event

        restEventMockMvc.perform(post("/api/events")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(event)))
                .andExpect(status().isCreated());

        // Validate the Event in the database
        List<Event> events = eventRepository.findAll();
        assertThat(events).hasSize(databaseSizeBeforeCreate + 1);
        Event testEvent = events.get(events.size() - 1);
        assertThat(testEvent.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testEvent.getStart()).isEqualTo(DEFAULT_START);
        assertThat(testEvent.getEnd()).isEqualTo(DEFAULT_END);
        assertThat(testEvent.isAllDay()).isEqualTo(DEFAULT_ALL_DAY);
    }

    @Test
    @Transactional
    public void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventRepository.findAll().size();
        // set the field null
        event.setTitle(null);

        // Create the Event, which fails.

        restEventMockMvc.perform(post("/api/events")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(event)))
                .andExpect(status().isBadRequest());

        List<Event> events = eventRepository.findAll();
        assertThat(events).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkStartIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventRepository.findAll().size();
        // set the field null
        event.setStart(null);

        // Create the Event, which fails.

        restEventMockMvc.perform(post("/api/events")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(event)))
                .andExpect(status().isBadRequest());

        List<Event> events = eventRepository.findAll();
        assertThat(events).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllEvents() throws Exception {
        // Initialize the database
        eventRepository.saveAndFlush(event);

        // Get all the events
        restEventMockMvc.perform(get("/api/events?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(event.getId().intValue())))
                .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
                .andExpect(jsonPath("$.[*].start").value(hasItem(DEFAULT_START.toString())))
                .andExpect(jsonPath("$.[*].end").value(hasItem(DEFAULT_END.toString())))
                .andExpect(jsonPath("$.[*].allDay").value(hasItem(DEFAULT_ALL_DAY.booleanValue())));
    }

    @Test
    @Transactional
    public void getEvent() throws Exception {
        // Initialize the database
        eventRepository.saveAndFlush(event);

        // Get the event
        restEventMockMvc.perform(get("/api/events/{id}", event.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(event.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()))
            .andExpect(jsonPath("$.start").value(DEFAULT_START.toString()))
            .andExpect(jsonPath("$.end").value(DEFAULT_END.toString()))
            .andExpect(jsonPath("$.allDay").value(DEFAULT_ALL_DAY.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingEvent() throws Exception {
        // Get the event
        restEventMockMvc.perform(get("/api/events/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEvent() throws Exception {
        // Initialize the database
        eventRepository.saveAndFlush(event);
        int databaseSizeBeforeUpdate = eventRepository.findAll().size();

        // Update the event
        Event updatedEvent = new Event();
        updatedEvent.setId(event.getId());
        updatedEvent.setTitle(UPDATED_TITLE);
        updatedEvent.setStart(UPDATED_START);
        updatedEvent.setEnd(UPDATED_END);
        updatedEvent.setAllDay(UPDATED_ALL_DAY);

        restEventMockMvc.perform(put("/api/events")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedEvent)))
                .andExpect(status().isOk());

        // Validate the Event in the database
        List<Event> events = eventRepository.findAll();
        assertThat(events).hasSize(databaseSizeBeforeUpdate);
        Event testEvent = events.get(events.size() - 1);
        assertThat(testEvent.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testEvent.getStart()).isEqualTo(UPDATED_START);
        assertThat(testEvent.getEnd()).isEqualTo(UPDATED_END);
        assertThat(testEvent.isAllDay()).isEqualTo(UPDATED_ALL_DAY);
    }

    @Test
    @Transactional
    public void deleteEvent() throws Exception {
        // Initialize the database
        eventRepository.saveAndFlush(event);
        int databaseSizeBeforeDelete = eventRepository.findAll().size();

        // Get the event
        restEventMockMvc.perform(delete("/api/events/{id}", event.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Event> events = eventRepository.findAll();
        assertThat(events).hasSize(databaseSizeBeforeDelete - 1);
    }
}
