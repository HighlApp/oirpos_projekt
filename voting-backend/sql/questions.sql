CREATE TABLE public."Questions"
(
    "Id" serial NOT NULL,
    "Name" character varying(200) COLLATE pg_catalog."default",
    "Type" character varying(4) COLLATE pg_catalog."default",
    "AdditionalData" character varying(1000) COLLATE pg_catalog."default",
    "VotingId" integer NOT NULL,
    "Active" boolean DEFAULT false,
    CONSTRAINT question_pkey PRIMARY KEY ("Id"),
    CONSTRAINT fk_votings FOREIGN KEY ("VotingId")
        REFERENCES public."Votings" ("Id")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Questions"
    OWNER to postgres;