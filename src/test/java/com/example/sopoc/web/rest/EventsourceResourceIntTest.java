package com.example.sopoc.web.rest;

import com.example.sopoc.SoPoCApp;
import com.example.sopoc.domain.Eventsource;
import com.example.sopoc.repository.EventsourceRepository;

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
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the EventsourceResource REST controller.
 *
 * @see EventsourceResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = SoPoCApp.class)
@WebAppConfiguration
@IntegrationTest
public class EventsourceResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB";

    @Inject
    private EventsourceRepository eventsourceRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restEventsourceMockMvc;

    private Eventsource eventsource;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        EventsourceResource eventsourceResource = new EventsourceResource();
        ReflectionTestUtils.setField(eventsourceResource, "eventsourceRepository", eventsourceRepository);
        this.restEventsourceMockMvc = MockMvcBuilders.standaloneSetup(eventsourceResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        eventsource = new Eventsource();
        eventsource.setName(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createEventsource() throws Exception {
        int databaseSizeBeforeCreate = eventsourceRepository.findAll().size();

        // Create the Eventsource

        restEventsourceMockMvc.perform(post("/api/eventsources")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(eventsource)))
                .andExpect(status().isCreated());

        // Validate the Eventsource in the database
        List<Eventsource> eventsources = eventsourceRepository.findAll();
        assertThat(eventsources).hasSize(databaseSizeBeforeCreate + 1);
        Eventsource testEventsource = eventsources.get(eventsources.size() - 1);
        assertThat(testEventsource.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void getAllEventsources() throws Exception {
        // Initialize the database
        eventsourceRepository.saveAndFlush(eventsource);

        // Get all the eventsources
        restEventsourceMockMvc.perform(get("/api/eventsources?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(eventsource.getId().intValue())))
                .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void getEventsource() throws Exception {
        // Initialize the database
        eventsourceRepository.saveAndFlush(eventsource);

        // Get the eventsource
        restEventsourceMockMvc.perform(get("/api/eventsources/{id}", eventsource.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(eventsource.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingEventsource() throws Exception {
        // Get the eventsource
        restEventsourceMockMvc.perform(get("/api/eventsources/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEventsource() throws Exception {
        // Initialize the database
        eventsourceRepository.saveAndFlush(eventsource);
        int databaseSizeBeforeUpdate = eventsourceRepository.findAll().size();

        // Update the eventsource
        Eventsource updatedEventsource = new Eventsource();
        updatedEventsource.setId(eventsource.getId());
        updatedEventsource.setName(UPDATED_NAME);

        restEventsourceMockMvc.perform(put("/api/eventsources")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedEventsource)))
                .andExpect(status().isOk());

        // Validate the Eventsource in the database
        List<Eventsource> eventsources = eventsourceRepository.findAll();
        assertThat(eventsources).hasSize(databaseSizeBeforeUpdate);
        Eventsource testEventsource = eventsources.get(eventsources.size() - 1);
        assertThat(testEventsource.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void deleteEventsource() throws Exception {
        // Initialize the database
        eventsourceRepository.saveAndFlush(eventsource);
        int databaseSizeBeforeDelete = eventsourceRepository.findAll().size();

        // Get the eventsource
        restEventsourceMockMvc.perform(delete("/api/eventsources/{id}", eventsource.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Eventsource> eventsources = eventsourceRepository.findAll();
        assertThat(eventsources).hasSize(databaseSizeBeforeDelete - 1);
    }
}
