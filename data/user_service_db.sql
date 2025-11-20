select * from addresses
select * from users

//Tạo bảng và dữ liệu users

CREATE TABLE users (
    id UUID PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password VARCHAR(255),
    role VARCHAR(20),
    image VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

INSERT INTO users (id, user_name, full_name, email, phone_number, password, role, created_at, updated_at) VALUES
('b008de0d-5ea3-4a7a-af75-8ee64e4c9fd1', 'merchant1', 'Le Tan Dat', 'merchant1@example.com', '0123456789', '$2b$10$8Hs4kbkrb1Q33afdq.Q88Op5mLf3MFmIqxIdB3bQULjKdxZACGTGe', 'merchant', '2025-11-08 18:06:57.493+07', '2025-11-08 18:06:57.493+07'),
('3fd7c595-57e1-4275-9183-52506033a63d', 'merchant2', 'Tran Gia Phuc', 'merchant2@example.com', '0909777123', '$2b$10$etsOPR.393YriCO9UYKHaO8fueXeqsNElRyE6jKeLvPTxz.jG1wf6', 'merchant', '2025-11-08 18:07:30.072+07', '2025-11-08 18:07:30.072+07'),
('5324c950-d209-44b7-9e1b-2c3d859a17af', 'user1', 'Nguyen Van A', 'user1@example.com', '0909778123', '$2b$10$bHjh/TvXxDiNsFy7.3kchOxUwX0K//FH/y2KZ8NhzpIkq.c5917Y.', 'customer', '2025-11-08 18:08:05.186+07', '2025-11-08 18:08:05.186+07'),
('c20eff4e-3681-4836-b03e-b2a3f7b3c5a6', 'merchant3', 'Nguyen Van A', 'merchant3@example.com', '0909677123', '$2b$10$rzLkqQ20qPaj7bHN9yjQI.IoBWp3lsUgLE03wnGX22Rg8AFTc/IA.', 'merchant', '2025-11-15 00:50:53.136+07', '2025-11-15 00:50:53.136+07'),
('68fd1ec7-2f5f-4940-b684-1ca45b332267', 'merchant4', 'Nguyen Van B', 'merchant4@example.com', '0906677123', '$2b$10$HcuZH4dDxeZulV58q0Gvs.FSOVNMf/YpWGUJdt38Bc5v.fq38Yd86', 'merchant', '2025-11-15 00:51:12.371+07', '2025-11-15 00:51:12.371+07'),
('f93207bd-64f0-429e-9c6b-93a1466486f8', 'merchant5', 'Nguyen Van C', 'merchant5@example.com', '0907677123', '$2b$10$ABCu2RxSxbr4LsgKhFlCGu2BGtxuNZBde1MqWMiEt2T9sJPIptgfS', 'merchant', '2025-11-15 00:51:38.192+07', '2025-11-15 00:51:38.192+07'),
('e67f2863-5f03-4dff-b247-478b140ab6c4', 'user2', 'Tran Van A', 'user2@example.com', '0905677123', '$2b$10$NVFS0V9VjGeRbCFq9u4iy.tWgmjqR6L/VHY/Fw1uVN64G8c18RYBS', 'customer', '2025-11-15 15:15:53.362+07', '2025-11-15 15:15:53.362+07'),
('cd83a6d0-8422-417d-845f-f9633cd6099e', 'user3', 'Tran Van B', 'user3@example.com', '0904677123', '$2b$10$XAAOOwmlzn2nlFITZHGf4.tRY3.fzC31VlJ56rrux2dNotURwbcjO', 'customer', '2025-11-15 15:16:09.139+07', '2025-11-15 15:16:09.139+07'),
('901ce87f-db7d-4ab2-a644-5b529b8a790b', 'user4', 'Tran Van C', 'user4@example.com', '0904577123', '$2b$10$Yw8Ky2cpF3wOr5A9ryLoU.0ocZRCbVcsGGSrZgyt6obw5hyWnZ3jW', 'customer', '2025-11-15 15:16:27.616+07', '2025-11-15 15:16:27.616+07');


//Tạo bảng và thêm dữ liệu cho addresses
CREATE TABLE addresses (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(50),
    geometry JSONB,
    full_address VARCHAR(255)
);

INSERT INTO addresses (id, user_id, label, full_address) VALUES
('d622044d-7259-4a95-9a9f-930935073821', '5324c950-d209-44b7-9e1b-2c3d859a17af', 'home', '123 Nguyen Sy Sach'),
('90408ebb-8c11-4bdf-a008-8ad2fcbc3683', '5324c950-d209-44b7-9e1b-2c3d859a17af', 'Công ty', '1 An Duong Vuong'),
('a734f72c-cac3-4387-8ec6-358438385954', '5324c950-d209-44b7-9e1b-2c3d859a17af', 'Lớp học thêm', '32 Đường số 2'),
('e6217da4-46b7-434f-ba84-69aab89f0dd0', 'e67f2863-5f03-4dff-b247-478b140ab6c4', 'Nhà ngoại', '1A Đường số 10'),
('d4ffbef0-8bcc-445e-9ea3-7bc854e2ad76', 'e67f2863-5f03-4dff-b247-478b140ab6c4', 'Nhà nội', '1D Bình Long'),
('7dc770af-615f-48a7-9c24-8baa3caf5571', 'e67f2863-5f03-4dff-b247-478b140ab6c4', 'Trường', '123 An Dương Vương');


