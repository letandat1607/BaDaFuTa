-- =============================================
-- 1. Bảng: merchant
-- =============================================
CREATE TABLE merchant (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    merchant_name VARCHAR(100) NOT NULL,
    location JSONB NOT NULL,
    phone VARCHAR(20),
    email VARCHAR NOT NULL UNIQUE,
    profile_image VARCHAR NOT NULL,
    cover_image VARCHAR,
    cuisin VARCHAR,
    time_open JSONB
);

INSERT INTO merchant (
    id, user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open
) VALUES
(
    'fb325480-5b1c-4c3b-a044-2fcac7ebce02',
    'b008de0d-5ea3-4a7a-af75-8ee64e4c9fd1',
    'McDonald''s Nguyễn Huệ',
    '{"lat": 10.7749, "lng": 106.7049, "address": "2 Nguyễn Huệ, Quận 1, TP.HCM"}',
    '028-3829-1234',
    'contact@mcdonalds.vn',
    '{"url": "https://images.unsplash.com/photo-1600891964599-f61ba0e24092"}',
    '{"url": "https://images.unsplash.com/photo-1571091718767-18b5b1457add"}',
    '{"friday":{"open":"08:00","close":"22:00"},"monday":{"open":"08:00","close":"22:00"},"sunday":{"open":"09:00","close":"21:00"},"tuesday":{"open":"08:00","close":"22:00"},"saturday":{"open":"09:00","close":"23:00"},"thursday":{"open":"08:00","close":"22:00"},"wednesday":{"open":"08:00","close":"22:00"}}'
),
(
    '6a53b3e2-4600-4a23-a630-fbfde8f6a6c5',
    '3fd7c595-57e1-4275-9183-52506033a63d',
    'Lottería Nguyễn Trãi',
    '{"lat": 10.7595, "lng": 106.6672, "address": "120 Nguyễn Trãi, Quận 5, TP.HCM"}',
    '028-3856-7890',
    'info@lotteria.vn',
    '{"url": "https://images.unsplash.com/photo-1571091718767-18b5b1457add"}',
    '{"url": "https://images.unsplash.com/photo-1579880872537-564eaf2b64d0"}',
    '{"friday":{"open":"08:00","close":"22:00"},"monday":{"open":"08:00","close":"22:00"},"sunday":{"open":"09:00","close":"21:00"},"tuesday":{"open":"08:00","close":"22:00"},"saturday":{"open":"09:00","close":"23:00"},"thursday":{"open":"08:00","close":"22:00"},"wednesday":{"open":"08:00","close":"22:00"}}'
),
(
    'c9df0e6a-3401-4661-8a8e-59ab54a08f33',
    'c20eff4e-3681-4836-b03e-b2a3f7b3c5a6',
    'KFC Lê Lợi',
    '{"lat": 10.7732, "lng": 106.7003, "address": "45 Lê Lợi, Quận 1, TP.HCM"}',
    '028-3939-5555',
    'support@kfc.vn',
    '{"url": "https://storage.googleapis.com/stateless.navee.asia/2023/06/d50a8303-kfc-1.png"}',
    '{"url": "https://storage.googleapis.com/stateless.navee.asia/2023/06/d50a8303-kfc-1.png"}',
    '{"friday":{"open":"08:00","close":"22:00"},"monday":{"open":"08:00","close":"22:00"},"sunday":{"open":"09:00","close":"21:00"},"tuesday":{"open":"08:00","close":"22:00"},"saturday":{"open":"09:00","close":"23:00"},"thursday":{"open":"08:00","close":"22:00"},"wednesday":{"open":"08:00","close":"22:00"}}'
),
(
    '51cc9136-0059-44cc-a64b-6083fccb95db',
    '68fd1ec7-2f5f-4940-b684-1ca45b332267',
    'Burger King Phạm Ngũ Lão',
    '{"lat": 10.7687, "lng": 106.6943, "address": "92 Phạm Ngũ Lão, Quận 1, TP.HCM"}',
    '028-3838-2222',
    'hello@burgerking.vn',
    '{"url": "https://th.bing.com/th/id/R.9f2706fff474d41f4e5663d42018fbfb?rik=Y9ejE18p4H5B0g&pid=ImgRaw&r=0"}',
    '{"url": "https://th.bing.com/th/id/R.9f2706fff474d41f4e5663d42018fbfb?rik=Y9ejE18p4H5B0g&pid=ImgRaw&r=0"}',
    '{"friday":{"open":"08:00","close":"22:00"},"monday":{"open":"08:00","close":"22:00"},"sunday":{"open":"09:00","close":"21:00"},"tuesday":{"open":"08:00","close":"22:00"},"saturday":{"open":"09:00","close":"23:00"},"thursday":{"open":"08:00","close":"22:00"},"wednesday":{"open":"08:00","close":"22:00"}}'
),
(
    '86b5e49b-d121-4af7-a00c-803250372eef',
    'f93207bd-64f0-429e-9c6b-93a1466486f8',
    'Texas Chicken Cộng Hòa',
    '{"lat": 10.8001, "lng": 106.6442, "address": "334 Cộng Hòa, Tân Bình, TP.HCM"}',
    '028-3948-8888',
    'order@texaschicken.vn',
    '{"url": "https://static.thairath.co.th/media/dFQROr7oWzulq5Fa6rBo8IFcr0WpTTNspA1LcCclq4CHleTXb0arfkrEmrFflIhMshv.jpg"}',
    '{"url": "https://static.thairath.co.th/media/dFQROr7oWzulq5Fa6rBo8IFcr0WpTTNspA1LcCclq4CHleTXb0arfkrEmrFflIhMshv.jpg"}',
    '{"friday":{"open":"08:00","close":"22:00"},"monday":{"open":"08:00","close":"22:00"},"sunday":{"open":"09:00","close":"21:00"},"tuesday":{"open":"08:00","close":"22:00"},"saturday":{"open":"09:00","close":"23:00"},"thursday":{"open":"08:00","close":"22:00"},"wednesday":{"open":"08:00","close":"22:00"}}'
);


-- =============================================
-- 2. Bảng: category
-- =============================================
CREATE TABLE category (
    id UUID PRIMARY KEY,
    merchant_id UUID NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    
    CONSTRAINT fk_category_merchant
        FOREIGN KEY (merchant_id) 
        REFERENCES merchant(id) 
        ON DELETE CASCADE
);

INSERT INTO category (id, merchant_id, category_name) VALUES
('21990a15-73a6-4391-9f3d-47a204006823', 'fb325480-5b1c-4c3b-a044-2fcac7ebce02', 'Pizza'),
('fcbdad39-5d4f-4af4-b99c-378c5ae49972', 'fb325480-5b1c-4c3b-a044-2fcac7ebce02', 'Đồ Uống'),
('6967bb6e-d1df-4ad0-8fbd-606f509e8feb', 'fb325480-5b1c-4c3b-a044-2fcac7ebce02', 'Cơm'),

('98bf08a0-637f-4ad6-b672-f3f1735ad55a', '6a53b3e2-4600-4a23-a630-fbfde8f6a6c5', 'Mì Ý'),
('9dcca9c9-e4fa-4bd6-88d6-964c9ddfb9e8', '6a53b3e2-4600-4a23-a630-fbfde8f6a6c5', 'Gà'),
('2987e0bf-c69a-46af-92c7-be54882ad7e2', '6a53b3e2-4600-4a23-a630-fbfde8f6a6c5', 'Nước'),
('e514d940-49c2-49b5-b564-d1eb397ac650', '6a53b3e2-4600-4a23-a630-fbfde8f6a6c5', 'Cơm'),

('edc6c8ab-e00a-4a52-9529-7ff14496c35c', 'c9df0e6a-3401-4661-8a8e-59ab54a08f33', 'Burger'),
('38ddce54-ac69-4c7b-9852-41b8ff7f5e06', 'c9df0e6a-3401-4661-8a8e-59ab54a08f33', 'Gà'),
('bc5190fe-bde0-4e5a-8c1f-c8f0e2a69bd6', 'c9df0e6a-3401-4661-8a8e-59ab54a08f33', 'Đồ Uống'),
('d484bc0b-c9c6-4a25-89e5-7cfd65921723', 'c9df0e6a-3401-4661-8a8e-59ab54a08f33', 'Cơm'),

('405eeb30-7eee-43ef-84f4-b14bb1f787f2', '51cc9136-0059-44cc-a64b-6083fccb95db', 'Burger'),
('b16d0a03-6d47-45a6-999c-271df703ee85', '51cc9136-0059-44cc-a64b-6083fccb95db', 'Gà'),
('18282a3b-eee8-4484-b965-eda67b4fa2dc', '51cc9136-0059-44cc-a64b-6083fccb95db', 'Khoai Tây Chiên'),
('405f45d3-9145-4961-b932-fc0d9983d9b4', '51cc9136-0059-44cc-a64b-6083fccb95db', 'Nước'),

('4e1f0253-8880-4bf8-b0f9-fb48056b6d6d', '86b5e49b-d121-4af7-a00c-803250372eef', 'Gà Rán'),
('fb74f5b3-be89-4591-b07c-b8fecfbf1eb6', '86b5e49b-d121-4af7-a00c-803250372eef', 'Burger'),
('ea51149b-6da0-4cc2-99e1-2219689b53da', '86b5e49b-d121-4af7-a00c-803250372eef', 'Cơm'),
('9b70e223-6917-4dfd-aaef-ed5e5c6dabd2', '86b5e49b-d121-4af7-a00c-803250372eef', 'Đồ Uống');


-- =============================================
-- 3. Bảng: menu_item
-- =============================================
CREATE TABLE menu_item (
    id UUID PRIMARY KEY,
    merchant_id UUID NOT NULL,
    category_id UUID,
    name_item VARCHAR(100) NOT NULL,
    price BIGINT NOT NULL CHECK (price >= 0),
    likes BIGINT DEFAULT 0,
    sold_count BIGINT DEFAULT 0,
    description TEXT,
    image_item JSONB,
    status BOOLEAN DEFAULT FALSE,
    
    CONSTRAINT fk_menuitem_merchant
        FOREIGN KEY (merchant_id) 
        REFERENCES merchant(id) 
        ON DELETE CASCADE,
        
    CONSTRAINT fk_menuitem_category
        FOREIGN KEY (category_id) 
        REFERENCES category(id) 
        ON DELETE SET NULL
);

INSERT INTO menu_item (
    id, merchant_id, category_id, name_item, price, likes, sold_count,
    description, image_item, status
) VALUES
('6434ea82-1629-4178-8d67-a0ac8e9039e9','fb325480-5b1c-4c3b-a044-2fcac7ebce02','21990a15-73a6-4391-9f3d-47a204006823','Pizza hải sản',140000,0,0,'Tôm, mực, nấm đùi gà','{"url": "https://bazantravel.com/cdn/medias/uploads/28/28073-pizza-hai-san-uc.jpg"}',true),
('749532bd-39d9-41af-8144-aa9e78b19ab6','fb325480-5b1c-4c3b-a044-2fcac7ebce02','21990a15-73a6-4391-9f3d-47a204006823','Pizza xúc xích',125000,0,0,'Xúc xích, thịt xông khói','{"url": "https://th.bing.com/th/id/OIP.Oq1r9ojtZPWNlQKTPqVSZgHaEK?o=7&cb=ucfimg2rm=3&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"}',true),
('8876ca00-25e0-49a2-8d41-d7e2643daa0a','fb325480-5b1c-4c3b-a044-2fcac7ebce02','21990a15-73a6-4391-9f3d-47a204006823','Pizza phô mai',130000,0,0,'Phô mai kéo sợi','{"url": "https://tse1.mm.bing.net/th/id/OIP.wRNdGmtM-2_KaxHdw1n5tQHaE8?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"}',true),
('a8dec63a-5688-49f5-96e1-581e78607d6b','fb325480-5b1c-4c3b-a044-2fcac7ebce02','21990a15-73a6-4391-9f3d-47a204006823','Pizza thịt xông khói',130000,0,0,'Thịt xông khói của Mỹ','{"url": "https://th.bing.com/th/id/R.d6faf152efecc2ab61d8b73bad17a9cf?rik=%2bRXUd8H1qnbaiA&pid=ImgRaw&r=0"}',true),
('0aeb9308-41ef-4caa-a2dd-554989fe0116','fb325480-5b1c-4c3b-a044-2fcac7ebce02','21990a15-73a6-4391-9f3d-47a204006823','Pizza rau củ',110000,0,0,'rau củ tươi dành cho người ăn chay','{"url": "https://tse3.mm.bing.net/th/id/OIP.npDOoSAVBhlACRp8IW8OvwHaE8?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"}',true),
('31d17dbf-5ba4-4c82-b3a8-e3ef1eb8c467','fb325480-5b1c-4c3b-a044-2fcac7ebce02','fcbdad39-5d4f-4af4-b99c-378c5ae49972','Coca',15000,0,0,'Coca','{"url": "https://tse3.mm.bing.net/th/id/OIP.VpiWGSk9L3nVa-0kwcOU9wHaE8?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"}',true),
('ad0b1750-9b50-42d1-bb00-c88d0bf70358','6a53b3e2-4600-4a23-a630-fbfde8f6a6c5','9dcca9c9-e4fa-4bd6-88d6-964c9ddfb9e8','Gà rán sôt phô mai',40000,0,0,'Gà rán sốt phô mai','{"url": "https://tse4.mm.bing.net/th/id/OIP.obvHPBvCJLjNhAArEvsswAHaHa?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"}',false),
('3e4dcc20-e282-4e45-ab43-5228f8473823','fb325480-5b1c-4c3b-a044-2fcac7ebce02','fcbdad39-5d4f-4af4-b99c-378c5ae49972','Pepsi',15000,0,0,'pepsi','{"url": "https://tse2.mm.bing.net/th/id/OIP.73fMAA7nhyd4hHPo3eizYwHaJQ?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"}',true),
('3840baf2-12d2-44d0-b47c-2f6168297122','fb325480-5b1c-4c3b-a044-2fcac7ebce02','6967bb6e-d1df-4ad0-8fbd-606f509e8feb','Cơm chiên dương châu',65000,0,0,'Cơm chiên với rau củ, tôm thịt','{"url": "https://tse4.mm.bing.net/th/id/OIP.bE9OW5-O1M9TBiLDkK_cxAHaEK?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"}',true),
('6b361fb1-d25b-4168-8898-425fc3ea80b4','fb325480-5b1c-4c3b-a044-2fcac7ebce02','6967bb6e-d1df-4ad0-8fbd-606f509e8feb','Cơm chiên cá mặn',65000,0,0,'Cơm chiên với cá mặn ăn kèm với rau củ','{"url": "https://daynauan.info.vn/wp-content/uploads/2019/11/com-chien-ca-man.jpg"}',true),
('c4316098-b41f-44ec-8a23-249118e57581','fb325480-5b1c-4c3b-a044-2fcac7ebce02','6967bb6e-d1df-4ad0-8fbd-606f509e8feb','Cơm chiên trứng',55000,0,0,'Cơm chiên trứng với tôm','{"url": "https://tse1.mm.bing.net/th/id/OIP.cIUcfCXlf-0qJX0gK8OMSwHaD4?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"}',true),
('8c8c4f15-8e84-4d49-b2a1-aadbbd2a5a65','6a53b3e2-4600-4a23-a630-fbfde8f6a6c5','9dcca9c9-e4fa-4bd6-88d6-964c9ddfb9e8','Gà rán truyền thông',36000,0,0,NULL,'{"url": "https://www.lotteria.vn/media/catalog/product/m/e/menu_3_mieng_ga_77k_1_.jpg"}',false),
('2a52bc90-e825-49a6-8887-7a9bcaa73992','fb325480-5b1c-4c3b-a044-2fcac7ebce02','fcbdad39-5d4f-4af4-b99c-378c5ae49972','Trà sữa truyền thống',25000,0,0,'trà sữa truyền thống','{"url": "https://th.bing.com/th/id/R.f7383ba7b93596d6205d4786918435e3?rik=Ybvi7mymt8rShw&pid=ImgRaw&r=0"}',true),
('253dfc8a-18ae-4cd4-abc8-b668c444d095','6a53b3e2-4600-4a23-a630-fbfde8f6a6c5','98bf08a0-637f-4ad6-b672-f3f1735ad55a','Mì Ý bò bằm',58000,0,0,'Mỳ ý với bò bằm','{"url": "https://tse2.mm.bing.net/th/id/OIP.RHMIMToVA88MuqgEkT0pzgHaFP?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"}',false),
('07f319fb-634d-470c-92af-3107b81b30b6','6a53b3e2-4600-4a23-a630-fbfde8f6a6c5','98bf08a0-637f-4ad6-b672-f3f1735ad55a','Mì Ý phô mai que',60000,0,0,'mì ý với phô mai que','{"url": "https://cdn.dealtoday.vn/img/s800x400/57667ab468564d1493b5d3855a2e9275.jpg?sign=EYQOoMFx0dWxa5aWz7fGdQ"}',false),
('a74e1df4-a59e-4ea1-8297-640825bb0165','6a53b3e2-4600-4a23-a630-fbfde8f6a6c5','98bf08a0-637f-4ad6-b672-f3f1735ad55a','Mì Ý thịt xông khói',70000,0,0,'Mì ý với thịt xông khói','{"url": "https://tse1.explicit.bing.net/th/id/OIP.Uo5CAZalEpZVMYjARnKhowHaHa?cb=ucfimg2ucfimg=1&w=960&h=960&rs=1&pid=ImgDetMain&o=7&rm=3"}',false),
('06140832-7ba7-444e-8b8e-173a0c53e5e0','6a53b3e2-4600-4a23-a630-fbfde8f6a6c5','e514d940-49c2-49b5-b564-d1eb397ac650','Cơm gà viên',65000,0,0,'Cơm gà viên','{"url": "https://voucherbox.vn/wp-content/uploads/2023/07/com-ga-Lotteria-2-300x210.jpg"}',false),
('e2cf4b65-f9ef-46e5-b3c1-121462cbe5c7','6a53b3e2-4600-4a23-a630-fbfde8f6a6c5','e514d940-49c2-49b5-b564-d1eb397ac650','Cơm bò sốt phô mai',65000,0,0,NULL,'{"url": "https://tse1.mm.bing.net/th/id/OIP.qy2JboJVWu9Zvkt3wKN_3wHaFj?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"}',false),
('2f13a016-b35d-4262-b256-7c0299821e98','6a53b3e2-4600-4a23-a630-fbfde8f6a6c5','2987e0bf-c69a-46af-92c7-be54882ad7e2','Pepsi',15000,0,0,NULL,'{"url": "https://th.bing.com/th/id/OIP.73fMAA7nhyd4hHPo3eizYwHaJQ?w=158&h=198&c=7&r=0&o=7&cb=ucfimg2&dpr=1.1&pid=1.7&rm=3&ucfimg=1"}',false),
('6c4db049-020a-40e5-a474-a5ba5f18851a','6a53b3e2-4600-4a23-a630-fbfde8f6a6c5','2987e0bf-c69a-46af-92c7-be54882ad7e2','Coca',15000,0,0,NULL,'{"url": "https://th.bing.com/th/id/OIP.cI500T2A_5F9bu5r8SOHvgHaE6?w=262&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.1&pid=1.7&rm=3&ucfimg=1"}',false),
('2b4edf93-52c6-4a45-a568-b7a1e3c556cc','6a53b3e2-4600-4a23-a630-fbfde8f6a6c5','2987e0bf-c69a-46af-92c7-be54882ad7e2','Trà sữa',25000,0,0,NULL,'{"url": "https://th.bing.com/th/id/OIP.i9AtGViwzg6ly4fO7UKvWwHaE8?w=273&h=182&c=7&r=0&o=7&cb=ucfimg2&dpr=1.1&pid=1.7&rm=3&ucfimg=1"}',false),
('b173e812-f3aa-4281-90a5-235934a06f2f','51cc9136-0059-44cc-a64b-6083fccb95db','405eeb30-7eee-43ef-84f4-b14bb1f787f2','Whopper',85000,0,0,'Burger bò nướng flame-grilled','{"url": "https://th.bing.com/th/id/OIP.lLcOVjg7Y_yrkLgtYnxMWAHaFF?w=247&h=180&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3"}',true),
('46542b37-2397-4118-9156-fa70c34814a1','51cc9136-0059-44cc-a64b-6083fccb95db','b16d0a03-6d47-45a6-999c-271df703ee85','Chicken Royale',70000,0,0,'Burger gà giòn','{"url": "https://th.bing.com/th/id/OIP.HG2L13fp6l06n_RKcHTzzwHaH_?w=152&h=180&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3"}',true),
('72476c8b-8bdf-4aeb-bcb3-7bedf2234e9b','51cc9136-0059-44cc-a64b-6083fccb95db','18282a3b-eee8-4484-b965-eda67b4fa2dc','Khoai Tây Chiên',30000,0,0,'Khoai tây chiên giòn','{"url": "https://tse2.mm.bing.net/th/id/OIP.Kz_YKtQaldM7E1LLUG8CwwHaET?rs=1&pid=ImgDetMain&o=7&rm=3"}',true),
('6bc12a1a-265b-4ee3-bcb4-e8105f335986','51cc9136-0059-44cc-a64b-6083fccb95db','405f45d3-9145-4961-b932-fc0d9983d9b4','Coca Cola',15000,0,0,'Nước ngọt','{"url": "https://tse1.mm.bing.net/th/id/OIP.e_UgnKRCpKqBT4fPeiq48QHaHa?w=500&h=500&rs=1&pid=ImgDetMain&o=7&rm=3"}',true),
('476fab38-5946-43f3-81db-39c251d5408e','86b5e49b-d121-4af7-a00c-803250372eef','4e1f0253-8880-4bf8-b0f9-fb48056b6d6d','Gà Rán Texas',38000,0,0,'Gà rán giòn cay','{"url": "https://hd1.hotdeal.vn/hinhanh/HCM/60993_0_body_-(8)-new.jpg"}',true),
('ce22fb3f-2ed5-439b-bb3b-7436083dc895','86b5e49b-d121-4af7-a00c-803250372eef','fb74f5b3-be89-4591-b07c-b8fecfbf1eb6','Spicy Chicken Burger',65000,0,0,'Burger gà cay','{"url": "https://tse2.mm.bing.net/th/id/OIP._oDOGG89DwjB_Mn-IQVoewAAAA?rs=1&pid=ImgDetMain&o=7&rm=3"}',true),
('3fa27205-3ace-4095-92b2-6e4d6cc7ac9f','6a53b3e2-4600-4a23-a630-fbfde8f6a6c5','9dcca9c9-e4fa-4bd6-88d6-964c9ddfb9e8','Gà sốt mắm',40000,0,0,'Gà sốt mắm lotteria','{"url": "https://th.bing.com/th/id/R.32f1561db697035148430be1a6062d7b?rik=o%2bMEc%2fG03RsVcQ&pid=ImgRaw&r=0"}',false),
('a82873d7-735f-4920-9f46-5140ca6a9622','c9df0e6a-3401-4661-8a8e-59ab54a08f33','edc6c8ab-e00a-4a52-9529-7ff14496c35c','Zinger Burger',75000,0,0,'Burger gà giòn cay','{"url": "https://th.bing.com/th/id/OIP.T9Sqi-pZZ37z-uEDJGtSrAHaHa?w=192&h=192&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3"}',true),
('afc6cbf1-8ee9-4204-8422-a928d7a5bb92','c9df0e6a-3401-4661-8a8e-59ab54a08f33','38ddce54-ac69-4c7b-9852-41b8ff7f5e06','Gà Rán KFC',35000,0,0,'Miếng gà rán nguyên vị','{"url": "https://nhahangminhkhue.com/wp-content/uploads/hinh-anh-ga-ran-kfc-dep_024412020.jpg"}',true),
('df0679ea-aca2-4f98-92a9-8298b6f63408','c9df0e6a-3401-4661-8a8e-59ab54a08f33','bc5190fe-bde0-4e5a-8c1f-c8f0e2a69bd6','Pepsi',15000,0,0,'Nước ngọt có gas','{"url": "https://th.bing.com/th/id/OIP.GGpd5JIB64Q3B1-zltLQjgAAAA?w=199&h=193&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3"}',true),
('36b73fd6-0c4b-4968-bb6d-f738d45da668','c9df0e6a-3401-4661-8a8e-59ab54a08f33','d484bc0b-c9c6-4a25-89e5-7cfd65921723','Cơm Gà KFC',60000,0,0,'Cơm gà sốt cay','{"url": "https://th.bing.com/th/id/OIP.W4M2Uy6tiVMtURAD9RbyxAHaGB?w=234&h=190&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3"}',true),
('93f0392a-c9d1-4086-bc2a-ad0e156653e7','86b5e49b-d121-4af7-a00c-803250372eef','ea51149b-6da0-4cc2-99e1-2219689b53da','Cơm Gà Texas',58000,0,0,'Cơm gà sốt mật ong','{"url": "https://tse1.mm.bing.net/th/id/OIP.HbMXq42a81NsOpM3c8EPwgHaFc?pid=ImgDet&w=206&h=150&c=7&dpr=1.1&o=7&rm=3"}',true),
('13e8c1a7-82fe-4a58-9c8e-30aff7a3015b','86b5e49b-d121-4af7-a00c-803250372eef','9b70e223-6917-4dfd-aaef-ed5e5c6dabd2','Trà Đào',20000,0,0,'Trà đào đá','{"url": "https://th.bing.com/th/id/OIP.VTAjjC8TNQa244tm5L7z9AHaFy?w=231&h=180&c=7&r=0&o=7&dpr=1.1&pid=1.7&rm=3"}',true);
-- =============================================
-- 4. Bảng: option
-- =============================================
CREATE TABLE option (
    id UUID PRIMARY KEY,
    merchant_id UUID NOT NULL,
    option_name VARCHAR(100) NOT NULL,
    multi_select BOOLEAN DEFAULT FALSE,
    require_select BOOLEAN DEFAULT FALSE,
    number_select BIGINT DEFAULT 0 CHECK (number_select >= 0),
    
    CONSTRAINT fk_option_merchant
        FOREIGN KEY (merchant_id) 
        REFERENCES merchant(id) 
        ON DELETE CASCADE
);

INSERT INTO option (id, merchant_id, option_name, multi_select, require_select, number_select) VALUES
('972bd2f8-0bb8-4625-9e55-5b19e0a578c7', 'fb325480-5b1c-4c3b-a044-2fcac7ebce02', 'Thạch', true, false, 1),
('63c98bf6-5593-4200-b1b4-d342ce3f1ce5', 'fb325480-5b1c-4c3b-a044-2fcac7ebce02', 'Size', false, true, 1),
('54c1d542-19c8-428e-939e-12c29d5f8033', '6a53b3e2-4600-4a23-a630-fbfde8f6a6c5', 'Gà', false, true, 1),
('7ecd5383-52e3-44d5-8fec-e94a6349b579', '6a53b3e2-4600-4a23-a630-fbfde8f6a6c5', 'Cơm', true, false, 1),
('70ff3f7d-6dbd-4c17-9c53-9ddf75641645', 'c9df0e6a-3401-4661-8a8e-59ab54a08f33', 'Size', false, true, 1),
('aad561c4-8659-4b8c-8f50-73a406eccd3e', 'c9df0e6a-3401-4661-8a8e-59ab54a08f33', 'Cay', false, true, 1),
('de23a123-954f-4a45-8bb7-02e3f3bcfddd', '51cc9136-0059-44cc-a64b-6083fccb95db', 'Size Burger', false, true, 1),
('01cfcbbf-a535-454e-99b4-032632bb6571', '86b5e49b-d121-4af7-a00c-803250372eef', 'Mức Cay', false, true, 1);

-- =============================================
-- 5. Bảng trung gian: menu_item_option
-- =============================================
CREATE TABLE menu_item_option (
    menu_item_id UUID NOT NULL,
    option_id UUID NOT NULL,
    
    PRIMARY KEY (menu_item_id, option_id),
    
    CONSTRAINT fk_mio_menuitem
        FOREIGN KEY (menu_item_id) 
        REFERENCES menu_item(id) 
        ON DELETE CASCADE,
        
    CONSTRAINT fk_mio_option
        FOREIGN KEY (option_id) 
        REFERENCES option(id) 
        ON DELETE CASCADE
);

INSERT INTO menu_item_option (menu_item_id, option_id) VALUES
('749532bd-39d9-41af-8144-aa9e78b19ab6', '63c98bf6-5593-4200-b1b4-d342ce3f1ce5'),
('6434ea82-1629-4178-8d67-a0ac8e9039e9', '63c98bf6-5593-4200-b1b4-d342ce3f1ce5'),
('0aeb9308-41ef-4caa-a2dd-554989fe0116', '63c98bf6-5593-4200-b1b4-d342ce3f1ce5'),
('2a52bc90-e825-49a6-8887-7a9bcaa73992', '972bd2f8-0bb8-4625-9e55-5b19e0a578c7'),
('ad0b1750-9b50-42d1-bb00-c88d0bf70358', '54c1d542-19c8-428e-939e-12c29d5f8033'),
('8c8c4f15-8e84-4d49-b2a1-aadbbd2a5a65', '54c1d542-19c8-428e-939e-12c29d5f8033'),
('3fa27205-3ace-4095-92b2-6e4d6cc7ac9f', '54c1d542-19c8-428e-939e-12c29d5f8033'),
('06140832-7ba7-444e-8b8e-173a0c53e5e0', '7ecd5383-52e3-44d5-8fec-e94a6349b579'),
('e2cf4b65-f9ef-46e5-b3c1-121462cbe5c7', '7ecd5383-52e3-44d5-8fec-e94a6349b579'),
('a82873d7-735f-4920-9f46-5140ca6a9622', '70ff3f7d-6dbd-4c17-9c53-9ddf75641645'),
('afc6cbf1-8ee9-4204-8422-a928d7a5bb92', 'aad561c4-8659-4b8c-8f50-73a406eccd3e'),
('b173e812-f3aa-4281-90a5-235934a06f2f', 'de23a123-954f-4a45-8bb7-02e3f3bcfddd'),
('476fab38-5946-43f3-81db-39c251d5408e', '01cfcbbf-a535-454e-99b4-032632bb6571');

-- =============================================
-- 6. Bảng: option_item
-- =============================================
CREATE TABLE option_item (
    id UUID PRIMARY KEY,
    option_id UUID NOT NULL,
    option_item_name VARCHAR(100) NOT NULL,
    price BIGINT NOT NULL CHECK (price >= 0),
    status BOOLEAN DEFAULT FALSE,
    status_select BOOLEAN DEFAULT FALSE,
    
    CONSTRAINT fk_optionitem_option
        FOREIGN KEY (option_id) 
        REFERENCES option(id) 
        ON DELETE CASCADE
);

INSERT INTO option_item (id, option_id, option_item_name, price, status_select, status) VALUES
('4f649403-dffb-430e-b075-ac58ec65e778', '54c1d542-19c8-428e-939e-12c29d5f8033', 'Không cay', 0, true, true),
('1fdd0d9a-ee03-4a2a-8351-b2f086dffe89', '54c1d542-19c8-428e-939e-12c29d5f8033', 'Cay', 0, false, true),
('b19c732f-f2de-4c46-a52c-8bbf7c90d8cf', '7ecd5383-52e3-44d5-8fec-e94a6349b579', 'Cơm thêm', 5000, false, true),
('1fc0a01a-1be1-45e6-a11d-489c21c8b54e', '63c98bf6-5593-4200-b1b4-d342ce3f1ce5', 'S', 0, false, true),
('fcef3d18-4aec-4623-8ace-5a6c7ddf82ef', '63c98bf6-5593-4200-b1b4-d342ce3f1ce5', 'L', 50000, false, true),
('39017e77-aaa7-40c9-9437-7bea77aa0f72', '972bd2f8-0bb8-4625-9e55-5b19e0a578c7', 'Thạch sương sáo', 5000, false, true),
('8fa242ae-2d17-4920-a340-661001fb769d', '63c98bf6-5593-4200-b1b4-d342ce3f1ce5', 'XL', 70000, true, true),
('a4da45d0-77f0-4d7d-b2fd-e8a91477de86', '972bd2f8-0bb8-4625-9e55-5b19e0a578c7', 'Trân châu đường hổ', 5000, true, true),
('58fac1ae-af68-48c0-b3f7-ff5de74e93ce', '972bd2f8-0bb8-4625-9e55-5b19e0a578c7', 'Thạch củ năng', 4000, false, true),
('bc9ff0b3-4c12-4182-a787-5b330213636e', '972bd2f8-0bb8-4625-9e55-5b19e0a578c7', 'Thạch dừa', 5000, false, true),
('b133879e-64ef-4899-9838-7084e11c3bbb', '63c98bf6-5593-4200-b1b4-d342ce3f1ce5', 'M', 45000, false, true),
('988a9e0a-269a-4f6c-ae19-4ad8fada6e05', '70ff3f7d-6dbd-4c17-9c53-9ddf75641645', 'M', 0, true, true),
('2ecbc56b-b57f-483d-b3d5-612e6ffd8e08', '70ff3f7d-6dbd-4c17-9c53-9ddf75641645', 'L', 10000, false, true),
('6777793d-ee58-4646-8ad4-25adc5f032a5', 'aad561c4-8659-4b8c-8f50-73a406eccd3e', 'Không cay', 0, true, true),
('06c09349-9903-4aed-a35f-edd0ec779000', 'aad561c4-8659-4b8c-8f50-73a406eccd3e', 'Cay nhẹ', 0, false, true),
('1c3ea076-9c9d-4b05-8b88-376d595f7c61', 'de23a123-954f-4a45-8bb7-02e3f3bcfddd', 'Whopper', 0, true, true),
('f77ceffd-dab0-4acc-8523-62c1fed205f1', 'de23a123-954f-4a45-8bb7-02e3f3bcfddd', 'Double', 30000, false, true),
('6d42a853-ed86-46fe-a6d9-72bcd931c504', '01cfcbbf-a535-454e-99b4-032632bb6571', 'Không cay', 0, true, true),
('f508a750-7939-4663-a615-d4fb4f9886a7', '01cfcbbf-a535-454e-99b4-032632bb6571', 'Cay vừa', 0, false, true);

-- =============================================
-- Select kiểm tra
-- =============================================
select * from menu_item
select * from category
select * from "option"
select * from menu_item_option
select * from option_item
