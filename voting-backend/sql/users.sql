CREATE TABLE public."Users"
(
    "Id" serial NOT NULL,
    "Username" character varying(50) COLLATE pg_catalog."default",
    "Password" character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY ("Id")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Users"
    OWNER to postgres;