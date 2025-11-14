--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_name character varying(100) NOT NULL,
    merchant_id uuid
);


ALTER TABLE public.category OWNER TO postgres;

--
-- Name: menu_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu_item (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    merchant_id uuid NOT NULL,
    category_id uuid,
    name_item character varying(255) NOT NULL,
    likes bigint DEFAULT 0,
    price bigint NOT NULL,
    description text,
    sold_count bigint DEFAULT 0,
    image_item jsonb,
    status boolean DEFAULT true
);


ALTER TABLE public.menu_item OWNER TO postgres;

--
-- Name: menu_item_option; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu_item_option (
    option_id uuid NOT NULL,
    menu_item_id uuid NOT NULL
);


ALTER TABLE public.menu_item_option OWNER TO postgres;

--
-- Name: merchant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.merchant (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    merchant_name character varying(255) NOT NULL,
    location jsonb,
    phone character varying(20),
    email character varying(100),
    profile_image jsonb,
    cover_image jsonb,
    time_open jsonb
);


ALTER TABLE public.merchant OWNER TO postgres;

--
-- Name: option; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.option (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    option_name character varying(100) NOT NULL,
    multi_select boolean DEFAULT false,
    require_select boolean DEFAULT false,
    number_select bigint DEFAULT 0
);


ALTER TABLE public.option OWNER TO postgres;

--
-- Name: option_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.option_item (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    option_id uuid NOT NULL,
    option_item_name character varying(100) NOT NULL,
    status boolean DEFAULT true,
    status_select boolean DEFAULT false
);


ALTER TABLE public.option_item OWNER TO postgres;

--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category (id, category_name, merchant_id) FROM stdin;
3863ae11-468f-40ca-87ed-8dc9a8312235	Burger	d17e6070-0234-40b8-a6ab-ced3c6811bd9
64fbce69-623b-4f40-ad40-242bb6316811	Fried Chicken	d17e6070-0234-40b8-a6ab-ced3c6811bd9
f6935017-6e2e-4b1e-88b7-3f0f51b189c5	Drinks	d17e6070-0234-40b8-a6ab-ced3c6811bd9
4af72431-1a34-41c7-9477-948f27840653	Combo Meals	d17e6070-0234-40b8-a6ab-ced3c6811bd9
05a23c2a-4602-4e5f-bf59-16a5467fdcb1	Fried Chicken	e920ab5f-136f-4071-aab3-cdd393c6d71d
0794db4a-dc8b-4128-8cdb-87c9beffd945	Combo Meals	e920ab5f-136f-4071-aab3-cdd393c6d71d
ad6b5998-972d-418b-96f4-d200a9f6879b	Drinks	e920ab5f-136f-4071-aab3-cdd393c6d71d
1a98b9ca-d822-4255-9ca7-682c665096aa	Burger	b864f8be-31cb-4b31-bd06-f52f2b04f8ac
a0165cc0-5e5c-4862-92ac-f4ee5f483abd	Drinks	b864f8be-31cb-4b31-bd06-f52f2b04f8ac
341fa0e4-d4ff-44bc-9ea2-d820e5481597	Burger	f94b6809-eb4a-4902-ae07-f4f8c044d6a9
339e6371-0b70-47b9-bd36-615a52f45cf5	Drinks	f94b6809-eb4a-4902-ae07-f4f8c044d6a9
6fe9c600-f88d-45d8-8c04-ef0d16bc7354	Combo Meals	f94b6809-eb4a-4902-ae07-f4f8c044d6a9
53c6ef52-61a0-4b11-8e17-a7f0902d4ade	Fried Chicken	2fd32193-5e7e-4d4f-955b-a3ff63762e04
c1690667-764a-4960-9e90-8cdc9716cb42	Combo Meals	2fd32193-5e7e-4d4f-955b-a3ff63762e04
ffb61820-6bbe-4189-ac2e-5af9e02c7c54	Drinks	2fd32193-5e7e-4d4f-955b-a3ff63762e04
\.


--
-- Data for Name: menu_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu_item (id, merchant_id, category_id, name_item, likes, price, description, sold_count, image_item, status) FROM stdin;
786c9ad5-833c-4245-bdb6-d2cd21d19add	d17e6070-0234-40b8-a6ab-ced3c6811bd9	3863ae11-468f-40ca-87ed-8dc9a8312235	Big Mac	0	65000	Burger biểu tượng với hai lớp bò, rau và sốt đặc trưng	520	{"url": "https://images.unsplash.com/photo-1600891964599-f61ba0e24092"}	t
caf2f837-4f30-4357-b18c-7559a1613905	d17e6070-0234-40b8-a6ab-ced3c6811bd9	1a98b9ca-d822-4255-9ca7-682c665096aa	Big Mac	0	65000	Burger biểu tượng với hai lớp bò, rau và sốt đặc trưng	520	{"url": "https://images.unsplash.com/photo-1600891964599-f61ba0e24092"}	t
b47dd136-f1fa-4182-aa6e-6dcfdc00f6e8	e920ab5f-136f-4071-aab3-cdd393c6d71d	64fbce69-623b-4f40-ad40-242bb6316811	Gà Rán Truyền Thống	0	45000	Miếng gà rán giòn rụm vị cay nhẹ	600	{"url": "https://images.unsplash.com/photo-1606755962773-0e34c7d6b18f"}	t
339a954f-f57e-459e-897c-5ea4bba1ff15	e920ab5f-136f-4071-aab3-cdd393c6d71d	05a23c2a-4602-4e5f-bf59-16a5467fdcb1	Gà Rán Truyền Thống	0	45000	Miếng gà rán giòn rụm vị cay nhẹ	600	{"url": "https://images.unsplash.com/photo-1606755962773-0e34c7d6b18f"}	t
9ad3ff0c-ab13-4698-9ae0-b7ae14976e3f	e920ab5f-136f-4071-aab3-cdd393c6d71d	53c6ef52-61a0-4b11-8e17-a7f0902d4ade	Gà Rán Truyền Thống	0	45000	Miếng gà rán giòn rụm vị cay nhẹ	600	{"url": "https://images.unsplash.com/photo-1606755962773-0e34c7d6b18f"}	t
e035cc08-c978-4cac-95b2-399b899ed396	e920ab5f-136f-4071-aab3-cdd393c6d71d	4af72431-1a34-41c7-9477-948f27840653	Combo Gà Rán + Pepsi	0	79000	1 miếng gà rán + 1 ly Pepsi 350ml	380	{"url": "https://images.unsplash.com/photo-1565958011705-44e21171f6f6"}	t
bd53088f-45d9-433d-bf25-d88323c05bca	e920ab5f-136f-4071-aab3-cdd393c6d71d	0794db4a-dc8b-4128-8cdb-87c9beffd945	Combo Gà Rán + Pepsi	0	79000	1 miếng gà rán + 1 ly Pepsi 350ml	380	{"url": "https://images.unsplash.com/photo-1565958011705-44e21171f6f6"}	t
8966f8fa-5757-432e-9831-184081d28454	e920ab5f-136f-4071-aab3-cdd393c6d71d	6fe9c600-f88d-45d8-8c04-ef0d16bc7354	Combo Gà Rán + Pepsi	0	79000	1 miếng gà rán + 1 ly Pepsi 350ml	380	{"url": "https://images.unsplash.com/photo-1565958011705-44e21171f6f6"}	t
89ba1238-f0de-457d-9c16-9482e1fc4d7a	e920ab5f-136f-4071-aab3-cdd393c6d71d	c1690667-764a-4960-9e90-8cdc9716cb42	Combo Gà Rán + Pepsi	0	79000	1 miếng gà rán + 1 ly Pepsi 350ml	380	{"url": "https://images.unsplash.com/photo-1565958011705-44e21171f6f6"}	t
7218d9b5-d2a3-4f6c-b34f-1b891d87a548	b864f8be-31cb-4b31-bd06-f52f2b04f8ac	3863ae11-468f-40ca-87ed-8dc9a8312235	Burger Tôm	0	55000	Burger với nhân tôm chiên giòn và rau tươi mát	250	{"url": "https://images.unsplash.com/photo-1571091718767-18b5b1457add"}	t
8f57dcd6-86a6-4d7f-aaba-3b78cbeaab38	b864f8be-31cb-4b31-bd06-f52f2b04f8ac	1a98b9ca-d822-4255-9ca7-682c665096aa	Burger Tôm	0	55000	Burger với nhân tôm chiên giòn và rau tươi mát	250	{"url": "https://images.unsplash.com/photo-1571091718767-18b5b1457add"}	t
e17068cb-0165-4ca2-ab1b-e05a06f708f6	b864f8be-31cb-4b31-bd06-f52f2b04f8ac	341fa0e4-d4ff-44bc-9ea2-d820e5481597	Burger Tôm	0	55000	Burger với nhân tôm chiên giòn và rau tươi mát	250	{"url": "https://images.unsplash.com/photo-1571091718767-18b5b1457add"}	t
095ac12c-4480-4707-a80e-5389e5c5c85e	f94b6809-eb4a-4902-ae07-f4f8c044d6a9	3863ae11-468f-40ca-87ed-8dc9a8312235	Whopper	0	69000	Burger bò nướng lửa than hương vị đậm đà	480	{"url": "https://images.unsplash.com/photo-1594007654729-407eedc4be6e"}	t
4695732c-1b5c-4077-9516-8021f3a38a4b	f94b6809-eb4a-4902-ae07-f4f8c044d6a9	1a98b9ca-d822-4255-9ca7-682c665096aa	Whopper	0	69000	Burger bò nướng lửa than hương vị đậm đà	480	{"url": "https://images.unsplash.com/photo-1594007654729-407eedc4be6e"}	t
1a309c55-fd6f-41b0-b453-00bf5662f06c	f94b6809-eb4a-4902-ae07-f4f8c044d6a9	341fa0e4-d4ff-44bc-9ea2-d820e5481597	Whopper	0	69000	Burger bò nướng lửa than hương vị đậm đà	480	{"url": "https://images.unsplash.com/photo-1594007654729-407eedc4be6e"}	t
870d5a70-8eb1-4d1d-a272-9bb61a2a4eed	f94b6809-eb4a-4902-ae07-f4f8c044d6a9	f6935017-6e2e-4b1e-88b7-3f0f51b189c5	Coca-Cola 350ml	0	15000	Nước ngọt Coca-Cola tươi mát	510	{"url": "https://images.unsplash.com/photo-1613472011676-340f95e8d09d"}	t
fde6e9bb-79ea-4d6a-8724-af47f6f58189	f94b6809-eb4a-4902-ae07-f4f8c044d6a9	ad6b5998-972d-418b-96f4-d200a9f6879b	Coca-Cola 350ml	0	15000	Nước ngọt Coca-Cola tươi mát	510	{"url": "https://images.unsplash.com/photo-1613472011676-340f95e8d09d"}	t
a1077df7-abf6-46d9-a1ad-65795745ba30	f94b6809-eb4a-4902-ae07-f4f8c044d6a9	a0165cc0-5e5c-4862-92ac-f4ee5f483abd	Coca-Cola 350ml	0	15000	Nước ngọt Coca-Cola tươi mát	510	{"url": "https://images.unsplash.com/photo-1613472011676-340f95e8d09d"}	t
e072f546-009f-45df-ac37-9fd3ba3950a4	f94b6809-eb4a-4902-ae07-f4f8c044d6a9	339e6371-0b70-47b9-bd36-615a52f45cf5	Coca-Cola 350ml	0	15000	Nước ngọt Coca-Cola tươi mát	510	{"url": "https://images.unsplash.com/photo-1613472011676-340f95e8d09d"}	t
c85e0d76-5c2c-408f-8303-689edcee9522	f94b6809-eb4a-4902-ae07-f4f8c044d6a9	ffb61820-6bbe-4189-ac2e-5af9e02c7c54	Coca-Cola 350ml	0	15000	Nước ngọt Coca-Cola tươi mát	510	{"url": "https://images.unsplash.com/photo-1613472011676-340f95e8d09d"}	t
cdf77159-0e7e-4058-8bfa-e42060c2b911	2fd32193-5e7e-4d4f-955b-a3ff63762e04	64fbce69-623b-4f40-ad40-242bb6316811	Gà Giòn Cay	0	49000	Gà rán cay đặc trưng của Texas Chicken	450	{"url": "https://images.unsplash.com/photo-1627308595186-e6bb3671285a"}	t
1a8de30f-ee82-4453-bfc9-7a2aa6729410	2fd32193-5e7e-4d4f-955b-a3ff63762e04	05a23c2a-4602-4e5f-bf59-16a5467fdcb1	Gà Giòn Cay	0	49000	Gà rán cay đặc trưng của Texas Chicken	450	{"url": "https://images.unsplash.com/photo-1627308595186-e6bb3671285a"}	t
affbe5bf-b617-466d-af49-714a94935e1e	2fd32193-5e7e-4d4f-955b-a3ff63762e04	53c6ef52-61a0-4b11-8e17-a7f0902d4ade	Gà Giòn Cay	0	49000	Gà rán cay đặc trưng của Texas Chicken	450	{"url": "https://images.unsplash.com/photo-1627308595186-e6bb3671285a"}	t
7abf1434-e45c-472f-9c74-71417fb1a2e6	2fd32193-5e7e-4d4f-955b-a3ff63762e04	4af72431-1a34-41c7-9477-948f27840653	Combo Gà + Khoai + Pepsi	0	89000	1 miếng gà, 1 phần khoai tây và Pepsi 350ml	300	{"url": "https://images.unsplash.com/photo-1615716271324-d7e4e0b3c13b"}	t
fbec0936-7dae-4f33-974f-0eafe4b1e4f1	2fd32193-5e7e-4d4f-955b-a3ff63762e04	0794db4a-dc8b-4128-8cdb-87c9beffd945	Combo Gà + Khoai + Pepsi	0	89000	1 miếng gà, 1 phần khoai tây và Pepsi 350ml	300	{"url": "https://images.unsplash.com/photo-1615716271324-d7e4e0b3c13b"}	t
ca981623-e657-4db4-ab79-2e2e5aff9d6d	2fd32193-5e7e-4d4f-955b-a3ff63762e04	6fe9c600-f88d-45d8-8c04-ef0d16bc7354	Combo Gà + Khoai + Pepsi	0	89000	1 miếng gà, 1 phần khoai tây và Pepsi 350ml	300	{"url": "https://images.unsplash.com/photo-1615716271324-d7e4e0b3c13b"}	t
c31a7cb0-44d7-4109-a832-2384a89c7bc6	2fd32193-5e7e-4d4f-955b-a3ff63762e04	c1690667-764a-4960-9e90-8cdc9716cb42	Combo Gà + Khoai + Pepsi	0	89000	1 miếng gà, 1 phần khoai tây và Pepsi 350ml	300	{"url": "https://images.unsplash.com/photo-1615716271324-d7e4e0b3c13b"}	t
902111bf-1814-4ec2-abe3-7ca95e7c9462	d17e6070-0234-40b8-a6ab-ced3c6811bd9	341fa0e4-d4ff-44bc-9ea2-d820e5481597	Big Mac Deluxe	0	65000	Big Mac phiên bản cao cấp với thêm thịt bò và sốt đặc biệt	520	{"url": "https://images.unsplash.com/photo-1571091718767-18b5b1457add"}	t
2597eabe-514b-4e46-b6ef-7758eac5f8a4	d17e6070-0234-40b8-a6ab-ced3c6811bd9	64fbce69-623b-4f40-ad40-242bb6316811	McChicken Classic	0	59000	Burger gà giòn tan với rau tươi và sốt mayonnaise truyền thống	430	{"url": "https://images.unsplash.com/photo-1606755962773-0b7be5eaa19f"}	t
3942c620-bdcd-4b9d-9b12-0e02f38eb810	d17e6070-0234-40b8-a6ab-ced3c6811bd9	05a23c2a-4602-4e5f-bf59-16a5467fdcb1	McChicken Spicy	0	59000	Phiên bản cay nồng với lớp gà giòn và sốt ớt đặc trưng	430	{"url": "https://images.unsplash.com/photo-1606756792954-ff9d2f6b9a65"}	t
16c1fa69-6fbc-4714-99d9-9a1752bec407	d17e6070-0234-40b8-a6ab-ced3c6811bd9	53c6ef52-61a0-4b11-8e17-a7f0902d4ade	McChicken Deluxe	0	59000	Burger gà giòn cao cấp, thêm phô mai và rau tươi	430	{"url": "https://images.unsplash.com/photo-1601924582971-c81eabf7a52e"}	t
9b5e5bb3-53c5-424d-a16b-1596a4b7a6e6	d17e6070-0234-40b8-a6ab-ced3c6811bd9	3863ae11-468f-40ca-87ed-8dc9a8312235	Burger Cá Hồi	0	70000	cá hồi, xà lách, dưa leo, cà chua, tương ớt, mayonee	0	{"url": "C:\\\\fakepath\\\\burger-ca-hoi-880.webp"}	f
5db65697-fe65-4952-ae50-942a08d14538	d17e6070-0234-40b8-a6ab-ced3c6811bd9	3863ae11-468f-40ca-87ed-8dc9a8312235	Burger Cừu	0	70000	Burger cừu con và chất lượng	0	{"url": "C:\\\\fakepath\\\\burger-ca-hoi-880.webp"}	f
a65badff-534f-4b50-b0d3-4fb366d075e5	d17e6070-0234-40b8-a6ab-ced3c6811bd9	64fbce69-623b-4f40-ad40-242bb6316811	Gà phô mai cay	0	75000	Gà giòn lắc phô mai	0	{"url": "C:\\\\fakepath\\\\burger-ca-hoi-880.webp"}	f
\.


--
-- Data for Name: menu_item_option; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu_item_option (option_id, menu_item_id) FROM stdin;
bf96baff-763e-419e-8ec9-af4adb056397	786c9ad5-833c-4245-bdb6-d2cd21d19add
bf96baff-763e-419e-8ec9-af4adb056397	caf2f837-4f30-4357-b18c-7559a1613905
bf96baff-763e-419e-8ec9-af4adb056397	902111bf-1814-4ec2-abe3-7ca95e7c9462
bf96baff-763e-419e-8ec9-af4adb056397	095ac12c-4480-4707-a80e-5389e5c5c85e
bf96baff-763e-419e-8ec9-af4adb056397	4695732c-1b5c-4077-9516-8021f3a38a4b
bf96baff-763e-419e-8ec9-af4adb056397	1a309c55-fd6f-41b0-b453-00bf5662f06c
ff0b8b9e-ca28-4003-b343-e2ffdfad1e54	786c9ad5-833c-4245-bdb6-d2cd21d19add
ff0b8b9e-ca28-4003-b343-e2ffdfad1e54	caf2f837-4f30-4357-b18c-7559a1613905
ff0b8b9e-ca28-4003-b343-e2ffdfad1e54	902111bf-1814-4ec2-abe3-7ca95e7c9462
ff0b8b9e-ca28-4003-b343-e2ffdfad1e54	095ac12c-4480-4707-a80e-5389e5c5c85e
ff0b8b9e-ca28-4003-b343-e2ffdfad1e54	4695732c-1b5c-4077-9516-8021f3a38a4b
ff0b8b9e-ca28-4003-b343-e2ffdfad1e54	1a309c55-fd6f-41b0-b453-00bf5662f06c
6a2059d5-dcfa-43fa-9974-770028f440e2	e035cc08-c978-4cac-95b2-399b899ed396
6a2059d5-dcfa-43fa-9974-770028f440e2	bd53088f-45d9-433d-bf25-d88323c05bca
6a2059d5-dcfa-43fa-9974-770028f440e2	8966f8fa-5757-432e-9831-184081d28454
6a2059d5-dcfa-43fa-9974-770028f440e2	89ba1238-f0de-457d-9c16-9482e1fc4d7a
6a2059d5-dcfa-43fa-9974-770028f440e2	7abf1434-e45c-472f-9c74-71417fb1a2e6
6a2059d5-dcfa-43fa-9974-770028f440e2	fbec0936-7dae-4f33-974f-0eafe4b1e4f1
6a2059d5-dcfa-43fa-9974-770028f440e2	ca981623-e657-4db4-ab79-2e2e5aff9d6d
6a2059d5-dcfa-43fa-9974-770028f440e2	c31a7cb0-44d7-4109-a832-2384a89c7bc6
\.


--
-- Data for Name: merchant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.merchant (id, user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open) FROM stdin;
d17e6070-0234-40b8-a6ab-ced3c6811bd9	2a75359e-e288-45bd-b37c-20ffc970d8e6	McDonald's Nguyễn Huệ	{"lat": 10.7749, "lng": 106.7049, "address": "2 Nguyễn Huệ, Quận 1, TP.HCM"}	028-3829-1234	contact@mcdonalds.vn	{"url": "https://images.unsplash.com/photo-1600891964599-f61ba0e24092"}	{"url": "https://images.unsplash.com/photo-1571091718767-18b5b1457add"}	{"friday": {"open": "08:00", "close": "22:00"}, "monday": {"open": "08:00", "close": "22:00"}, "sunday": {"open": "09:00", "close": "21:00"}, "tuesday": {"open": "08:00", "close": "22:00"}, "saturday": {"open": "09:00", "close": "23:00"}, "thursday": {"open": "08:00", "close": "22:00"}, "wednesday": {"open": "08:00", "close": "22:00"}}
e920ab5f-136f-4071-aab3-cdd393c6d71d	33333333-3333-3333-3333-333333333333	KFC Lê Lợi	{"lat": 10.7732, "lng": 106.7003, "address": "45 Lê Lợi, Quận 1, TP.HCM"}	028-3939-5555	support@kfc.vn	{"url": "https://images.unsplash.com/photo-1590080875831-7c63f92eae9c"}	{"url": "https://images.unsplash.com/photo-1585238341986-4d0cbd6c3f99"}	{"friday": {"open": "08:00", "close": "22:00"}, "monday": {"open": "08:00", "close": "22:00"}, "sunday": {"open": "09:00", "close": "21:00"}, "tuesday": {"open": "08:00", "close": "22:00"}, "saturday": {"open": "09:00", "close": "23:00"}, "thursday": {"open": "08:00", "close": "22:00"}, "wednesday": {"open": "08:00", "close": "22:00"}}
b864f8be-31cb-4b31-bd06-f52f2b04f8ac	44444444-4444-4444-4444-444444444444	Lotteria Nguyễn Trãi	{"lat": 10.7595, "lng": 106.6672, "address": "120 Nguyễn Trãi, Quận 5, TP.HCM"}	028-3856-7890	info@lotteria.vn	{"url": "https://images.unsplash.com/photo-1571091718767-18b5b1457add"}	{"url": "https://images.unsplash.com/photo-1579880872537-564eaf2b64d0"}	{"friday": {"open": "08:00", "close": "22:00"}, "monday": {"open": "08:00", "close": "22:00"}, "sunday": {"open": "09:00", "close": "21:00"}, "tuesday": {"open": "08:00", "close": "22:00"}, "saturday": {"open": "09:00", "close": "23:00"}, "thursday": {"open": "08:00", "close": "22:00"}, "wednesday": {"open": "08:00", "close": "22:00"}}
f94b6809-eb4a-4902-ae07-f4f8c044d6a9	55555555-5555-5555-5555-555555555555	Burger King Phạm Ngũ Lão	{"lat": 10.7687, "lng": 106.6943, "address": "92 Phạm Ngũ Lão, Quận 1, TP.HCM"}	028-3838-2222	hello@burgerking.vn	{"url": "https://images.unsplash.com/photo-1594007654729-407eedc4be6e"}	{"url": "https://images.unsplash.com/photo-1606755962773-0b7be5eaa19f"}	{"friday": {"open": "08:00", "close": "22:00"}, "monday": {"open": "08:00", "close": "22:00"}, "sunday": {"open": "09:00", "close": "21:00"}, "tuesday": {"open": "08:00", "close": "22:00"}, "saturday": {"open": "09:00", "close": "23:00"}, "thursday": {"open": "08:00", "close": "22:00"}, "wednesday": {"open": "08:00", "close": "22:00"}}
2fd32193-5e7e-4d4f-955b-a3ff63762e04	66666666-6666-6666-6666-666666666666	Texas Chicken Cộng Hòa	{"lat": 10.8001, "lng": 106.6442, "address": "334 Cộng Hòa, Tân Bình, TP.HCM"}	028-3948-8888	order@texaschicken.vn	{"url": "https://images.unsplash.com/photo-1627308595186-e6bb3671285a"}	{"url": "https://images.unsplash.com/photo-1615716271324-d7e4e0b3c13b"}	{"friday": {"open": "08:00", "close": "22:00"}, "monday": {"open": "08:00", "close": "22:00"}, "sunday": {"open": "09:00", "close": "21:00"}, "tuesday": {"open": "08:00", "close": "22:00"}, "saturday": {"open": "09:00", "close": "23:00"}, "thursday": {"open": "08:00", "close": "22:00"}, "wednesday": {"open": "08:00", "close": "22:00"}}
\.


--
-- Data for Name: option; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.option (id, option_name, multi_select, require_select, number_select) FROM stdin;
bf96baff-763e-419e-8ec9-af4adb056397	Chọn Size	f	t	1
ff0b8b9e-ca28-4003-b343-e2ffdfad1e54	Thêm Phô Mai	f	f	1
6a2059d5-dcfa-43fa-9974-770028f440e2	Nước Uống	t	f	2
\.


--
-- Data for Name: option_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.option_item (id, option_id, option_item_name, status, status_select) FROM stdin;
1da32288-9fb4-430e-9b1b-42af9dc336ba	bf96baff-763e-419e-8ec9-af4adb056397	Size Nhỏ	t	f
fc624392-efea-4ac0-bb5c-b2f6cf313d4e	bf96baff-763e-419e-8ec9-af4adb056397	Size Lớn	t	f
074fa85c-1a7a-4c21-b4ce-4f8751141c78	ff0b8b9e-ca28-4003-b343-e2ffdfad1e54	Có thêm phô mai (+10k)	t	f
d59952bb-44a4-4e3f-ba91-b6b3e400a85f	ff0b8b9e-ca28-4003-b343-e2ffdfad1e54	Không thêm phô mai	t	f
bc04c277-84aa-488b-bf77-4d8adfcde3b9	6a2059d5-dcfa-43fa-9974-770028f440e2	Pepsi	t	f
4b745f90-7992-4c30-87ca-f8d50816a866	6a2059d5-dcfa-43fa-9974-770028f440e2	7Up	t	f
a86a7fab-a86c-4f71-8eab-a6efd058aa9e	6a2059d5-dcfa-43fa-9974-770028f440e2	Coke	t	f
\.


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- Name: menu_item_option menu_item_option_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_item_option
    ADD CONSTRAINT menu_item_option_pkey PRIMARY KEY (option_id, menu_item_id);


--
-- Name: menu_item menu_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_item
    ADD CONSTRAINT menu_item_pkey PRIMARY KEY (id);


--
-- Name: merchant merchant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merchant
    ADD CONSTRAINT merchant_pkey PRIMARY KEY (id);


--
-- Name: option_item option_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.option_item
    ADD CONSTRAINT option_item_pkey PRIMARY KEY (id);


--
-- Name: option option_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.option
    ADD CONSTRAINT option_pkey PRIMARY KEY (id);


--
-- Name: category fk_category_merchant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT fk_category_merchant FOREIGN KEY (merchant_id) REFERENCES public.merchant(id) ON DELETE CASCADE;


--
-- Name: menu_item menu_item_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_item
    ADD CONSTRAINT menu_item_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id) ON DELETE SET NULL;


--
-- Name: menu_item menu_item_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_item
    ADD CONSTRAINT menu_item_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.merchant(id) ON DELETE CASCADE;


--
-- Name: menu_item_option menu_item_option_menu_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_item_option
    ADD CONSTRAINT menu_item_option_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_item(id) ON DELETE CASCADE;


--
-- Name: menu_item_option menu_item_option_option_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_item_option
    ADD CONSTRAINT menu_item_option_option_id_fkey FOREIGN KEY (option_id) REFERENCES public.option(id) ON DELETE CASCADE;


--
-- Name: option_item option_item_option_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.option_item
    ADD CONSTRAINT option_item_option_id_fkey FOREIGN KEY (option_id) REFERENCES public.option(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

