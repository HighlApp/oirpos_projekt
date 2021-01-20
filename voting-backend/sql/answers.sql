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