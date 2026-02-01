--
-- PostgreSQL database dump
--

\restrict 9JdbQYoxnfJqPnjn5gHgcKxH4WrwBN9rAgWVxnoa8D4dx1rhDFScatiQkFp8K5H

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: columns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.columns (
    id integer NOT NULL,
    name text NOT NULL,
    project_id integer NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: columns_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.columns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: columns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.columns_id_seq OWNED BY public.columns.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    task_id integer NOT NULL,
    user_id character varying NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    workspace_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


--
-- Name: subtasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subtasks (
    id integer NOT NULL,
    task_id integer NOT NULL,
    title text NOT NULL,
    completed boolean DEFAULT false,
    "order" integer DEFAULT 0 NOT NULL
);


--
-- Name: subtasks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.subtasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subtasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.subtasks_id_seq OWNED BY public.subtasks.id;


--
-- Name: task_assignees; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.task_assignees (
    id integer NOT NULL,
    task_id integer NOT NULL,
    user_id character varying NOT NULL
);


--
-- Name: task_assignees_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.task_assignees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: task_assignees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.task_assignees_id_seq OWNED BY public.task_assignees.id;


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    column_id integer NOT NULL,
    title text NOT NULL,
    description text,
    priority text DEFAULT 'medium'::text,
    due_date timestamp without time zone,
    "order" integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email character varying,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: workspace_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.workspace_members (
    id integer NOT NULL,
    workspace_id integer NOT NULL,
    user_id character varying NOT NULL,
    role text DEFAULT 'member'::text NOT NULL,
    joined_at timestamp without time zone DEFAULT now()
);


--
-- Name: workspace_members_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.workspace_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: workspace_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.workspace_members_id_seq OWNED BY public.workspace_members.id;


--
-- Name: workspaces; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.workspaces (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    owner_id character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: workspaces_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.workspaces_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: workspaces_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.workspaces_id_seq OWNED BY public.workspaces.id;


--
-- Name: columns id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.columns ALTER COLUMN id SET DEFAULT nextval('public.columns_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: subtasks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subtasks ALTER COLUMN id SET DEFAULT nextval('public.subtasks_id_seq'::regclass);


--
-- Name: task_assignees id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_assignees ALTER COLUMN id SET DEFAULT nextval('public.task_assignees_id_seq'::regclass);


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Name: workspace_members id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workspace_members ALTER COLUMN id SET DEFAULT nextval('public.workspace_members_id_seq'::regclass);


--
-- Name: workspaces id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workspaces ALTER COLUMN id SET DEFAULT nextval('public.workspaces_id_seq'::regclass);


--
-- Data for Name: columns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.columns (id, name, project_id, "order", created_at) FROM stdin;
1	To Do	1	0	2026-02-01 14:30:26.468455
2	In Progress	1	1	2026-02-01 14:30:26.472449
3	Done	1	2	2026-02-01 14:30:26.478083
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.comments (id, task_id, user_id, content, created_at) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.projects (id, name, description, workspace_id, created_at) FROM stdin;
1	My Project	Get started with your first project	1	2026-02-01 14:30:26.440206
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (sid, sess, expire) FROM stdin;
CQ-5SfC4y2uwP27z4kyOgXB5ExNw8I-T	{"cookie": {"path": "/", "secure": true, "expires": "2026-02-08T21:37:11.963Z", "httpOnly": true, "originalMaxAge": 604800000}, "passport": {"user": {"claims": {"aud": "20de4ec6-57a0-4ed4-bdbe-4fa9e7e97c84", "exp": 1769985431, "iat": 1769981831, "iss": "https://replit.com/oidc", "sub": "54057351", "email": "itmmagb1@gmail.com", "at_hash": "-GxvR9WJSXugVrZhxU4vgg", "username": "itmmagb1", "auth_time": 1769956225, "last_name": null, "first_name": "magb1", "email_verified": true}, "expires_at": 1769985431, "access_token": "u5iAlW7iQDNNtDf8mZ0UhzpeD1xd73Aglhj9jtPfjpI", "refresh_token": "uZfmNtqQ62hx-UyzNP77kXjwqCdEyeT0TUqie_sbyAn"}}}	2026-02-08 21:43:10
\.


--
-- Data for Name: subtasks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subtasks (id, task_id, title, completed, "order") FROM stdin;
\.


--
-- Data for Name: task_assignees; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.task_assignees (id, task_id, user_id) FROM stdin;
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tasks (id, column_id, title, description, priority, due_date, "order", created_at, updated_at) FROM stdin;
2	1	Explore the features	Click on a task to see details.	medium	\N	1	2026-02-01 14:30:26.484695	2026-02-01 14:30:26.484695
1	2	Welcome to your new project!	Try dragging this task to another column.	high	\N	0	2026-02-01 14:30:26.481531	2026-02-01 14:30:45.165
3	1	test		medium	\N	0	2026-02-01 14:31:09.160837	2026-02-01 14:31:09.160837
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, first_name, last_name, profile_image_url, created_at, updated_at) FROM stdin;
54057351	itmmagb1@gmail.com	magb1	\N	\N	2026-02-01 14:30:25.450895	2026-02-01 14:30:25.450895
\.


--
-- Data for Name: workspace_members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.workspace_members (id, workspace_id, user_id, role, joined_at) FROM stdin;
\.


--
-- Data for Name: workspaces; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.workspaces (id, name, description, owner_id, created_at) FROM stdin;
1	My Workspace	Your first workspace	54057351	2026-02-01 14:30:26.433313
\.


--
-- Name: columns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.columns_id_seq', 3, true);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.comments_id_seq', 1, false);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.projects_id_seq', 1, true);


--
-- Name: subtasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.subtasks_id_seq', 1, false);


--
-- Name: task_assignees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.task_assignees_id_seq', 1, false);


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tasks_id_seq', 3, true);


--
-- Name: workspace_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.workspace_members_id_seq', 1, false);


--
-- Name: workspaces_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.workspaces_id_seq', 1, true);


--
-- Name: columns columns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.columns
    ADD CONSTRAINT columns_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: subtasks subtasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subtasks
    ADD CONSTRAINT subtasks_pkey PRIMARY KEY (id);


--
-- Name: task_assignees task_assignees_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_assignees
    ADD CONSTRAINT task_assignees_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: workspace_members workspace_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workspace_members
    ADD CONSTRAINT workspace_members_pkey PRIMARY KEY (id);


--
-- Name: workspaces workspaces_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workspaces
    ADD CONSTRAINT workspaces_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Name: columns columns_project_id_projects_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.columns
    ADD CONSTRAINT columns_project_id_projects_id_fk FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: comments comments_task_id_tasks_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_task_id_tasks_id_fk FOREIGN KEY (task_id) REFERENCES public.tasks(id);


--
-- Name: comments comments_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: projects projects_workspace_id_workspaces_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_workspace_id_workspaces_id_fk FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id);


--
-- Name: subtasks subtasks_task_id_tasks_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subtasks
    ADD CONSTRAINT subtasks_task_id_tasks_id_fk FOREIGN KEY (task_id) REFERENCES public.tasks(id);


--
-- Name: task_assignees task_assignees_task_id_tasks_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_assignees
    ADD CONSTRAINT task_assignees_task_id_tasks_id_fk FOREIGN KEY (task_id) REFERENCES public.tasks(id);


--
-- Name: task_assignees task_assignees_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_assignees
    ADD CONSTRAINT task_assignees_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: tasks tasks_column_id_columns_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_column_id_columns_id_fk FOREIGN KEY (column_id) REFERENCES public.columns(id);


--
-- Name: workspace_members workspace_members_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workspace_members
    ADD CONSTRAINT workspace_members_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: workspace_members workspace_members_workspace_id_workspaces_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workspace_members
    ADD CONSTRAINT workspace_members_workspace_id_workspaces_id_fk FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id);


--
-- Name: workspaces workspaces_owner_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workspaces
    ADD CONSTRAINT workspaces_owner_id_users_id_fk FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 9JdbQYoxnfJqPnjn5gHgcKxH4WrwBN9rAgWVxnoa8D4dx1rhDFScatiQkFp8K5H

