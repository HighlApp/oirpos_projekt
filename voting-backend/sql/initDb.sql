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
    
CREATE TABLE public."Answers"
(
    "Id" serial NOT NULL,
	"Value" character varying(200) COLLATE pg_catalog."default",
    "TokenId" integer,
    "QuestionId" integer,
    CONSTRAINT answer_pkey PRIMARY KEY ("Id"),
    CONSTRAINT fk_questions FOREIGN KEY ("QuestionId")
        REFERENCES public."Questions" ("Id"),
    CONSTRAINT fk_tokens FOREIGN KEY ("TokenId")
        REFERENCES public."Tokens" ("Id")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Answers"
    OWNER to postgres;
    
    
INSERT INTO public."Users"(
	"Id", "Username", "Password")
	VALUES (1, 'admin', '1234');