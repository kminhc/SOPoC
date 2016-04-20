package com.example.sopoc.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Eventsource.
 */
@Entity
@Table(name = "eventsource")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Eventsource implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Size(max = 50)
    @Column(name = "name", length = 50)
    private String name;

    @ManyToOne
    private User user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Eventsource eventsource = (Eventsource) o;
        if(eventsource.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, eventsource.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Eventsource{" +
            "id=" + id +
            ", name='" + name + "'" +
            '}';
    }
}
