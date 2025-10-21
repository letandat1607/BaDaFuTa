const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_USER,
});

const insertSeeds = async ()=>{
    try{
        await pool.query(
        `
            DELETE FROM users 
            WHERE 1=1;
            
            DELETE FROM addresses
            WHERE 1=1;

            DELETE FROM roles 
            WHERE 1=1;

            DELETE FROM user_roles 
            WHERE 1=1;

            INSERT INTO users (id, user_name, full_name, email, phone_number, password, image)
            VALUES
            ('u1', 'jdoe', 'John Doe', 'john.doe@example.com', '0123456789', 'hashed_password1', 'avatar1.png'),
            ('u2', 'asmith', 'Alice Smith', 'alice.smith@example.com', '0987654321', 'hashed_password2', 'avatar2.png'),
            ('u3', 'bwong', 'Bob Wong', 'bob.wong@example.com', NULL, 'hashed_password3', NULL);

            INSERT INTO roles (id, role_name)
            VALUES
            ('r1', 'admin'),
            ('r2', 'customer'),
            ('r3', 'merchant');

            INSERT INTO addresses (id, user_id, label, geometry, full_address)
            VALUES
            ('a1', 'u1', 'Home', '{"lat": 10.762622, "lon": 106.660172}', '123 Lê Lợi, Quận 1, TP.HCM'),
            ('a2', 'u1', 'Work', '{"lat": 10.776889, "lon": 106.700806}', '456 Nguyễn Huệ, Quận 1, TP.HCM'),
            ('a3', 'u2', 'Home', '{"lat": 21.027763, "lon": 105.834160}', '789 Hoàn Kiếm, Hà Nội');

            INSERT INTO user_roles (user_id, role_id)
            VALUES
            ('u1', 'r1'),  -- John Doe là admin
            ('u1', 'r2'),  -- John Doe cũng là customer
            ('u2', 'r2'),  -- Alice là customer
            ('u3', 'r3');  -- Bob là manager
        `
        );
        console.log("Insert seeds complete");
    }catch (error){
        console.log("Insert seeds Erorr: ", error);
    }
}

module.exports = {
  insertSeeds
};
