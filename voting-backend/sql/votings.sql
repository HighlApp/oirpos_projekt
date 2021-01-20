CREATE TABLE public."Votings"
(
    "Id" serial NOT NULL,
    "Name" character varying(200) COLLATE pg_catalog."default",
    CONSTRAINT voting_pkey PRIMARY KEY ("Id")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Votings"
    OWNER to postgres;