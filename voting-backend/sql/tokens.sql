CREATE TABLE public."Tokens"
(
    "Id" serial NOT NULL,
    "Uuid" character varying(50) COLLATE pg_catalog."default",
    "IsValid" boolean,
    "VotingId" integer NOT NULL,
    CONSTRAINT token_pkey PRIMARY KEY ("Id"),
    CONSTRAINT fk_votings FOREIGN KEY ("VotingId")
        REFERENCES public."Votings" ("Id")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Tokens"
    OWNER to postgres;