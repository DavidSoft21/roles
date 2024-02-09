CREATE DATABASE compumundohipermegared;

CREATE TYPE status AS ENUM (
    'active',
    'inactive',
    'pending'
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name character varying(255) NOT NULL
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name character varying(255) NOT NULL
);

CREATE TABLE permissions_roles (
    permission_id integer NOT NULL REFERENCES permissions(id),
    role_id integer NOT NULL REFERENCES roles(id)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    bussiness_name character varying(255) NOT NULL,
    tax_id_number character varying(255),
    phone_number character varying(255),
    adress character varying(255),
    email character varying(255) NOT NULL UNIQUE,
    current_status status,
    created_at date NOT NULL,
    update_at date NOT NULL,
    agent_id integer,
    role_id integer NOT NULL REFERENCES roles(id),
    password character varying NOT NULL,
    CONSTRAINT fk_agent_id FOREIGN KEY (agent_id) REFERENCES users(id)
);

ALTER TABLE users ALTER COLUMN bussiness_name DROP NOT NULL;
ALTER TABLE users ALTER COLUMN created_at DROP NOT NULL;
ALTER TABLE users ALTER COLUMN update_at DROP NOT NULL;