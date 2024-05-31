

CREATE TABLE customers(
    id int AUTO_INCREMENT,
    name varchar(150),
    username varchar(24) UNIQUE,
    email varchar(100) UNIQUE,
    password varchar(255),
    gender varchar(20),
    birthdate date,
    created_at date,
    status int DEFAULT 1,
    PRIMARY KEY (id)
);

CREATE TABLE tokens(
    id int AUTO_INCREMENT,
    customer_id int,
    token text,
    FOREIGN KEY(customer_id) REFERENCES customers(id),
    PRIMARY KEY (id)
);

CREATE TABLE categories (
    id int AUTO_INCREMENT,
    category VARCHAR(255) NOT NULL,
    description text,
    PRIMARY KEY(id)
);

CREATE TABLE products (
    id int AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    thumbnail text,
    category_id int,
    description TEXT,
    status int DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    PRIMARY KEY(id)
);

INSERT INTO products VALUES (0, 'Tshirt', 1, '', 0)

CREATE TABLE product_files (
    id int AUTO_INCREMENT,
    url_path text,
    product_id int,
    FOREIGN KEY (product_id) REFERENCES products(id),
    PRIMARY KEY(id)
);

CREATE TABLE product_entry (
    id int AUTO_INCREMENT,
    ids VARCHAR(255) UNIQUE,
    preview text,
    name VARCHAR(255),
    price decimal(9, 2),
    on_sale_price decimal(9, 2),
    is_on_sale boolean DEFAULT 0,
    stock int,
    product_id int,
    FOREIGN KEY (product_id) REFERENCES products(id),
    PRIMARY KEY(id)
);

INSERT INTO product_entry VALUES (0, "Tshirt Red, L", 100, 20, 4);

CREATE TABLE variants (
    id int  AUTO_INCREMENT,
    variant VARCHAR(255),
    product_id int,
    FOREIGN KEY (product_id) REFERENCES products(id),
    PRIMARY KEY(id)
);

INSERT INTO variants VALUES(0, 'Color', 4);

CREATE TABLE variant_options (
    id int  AUTO_INCREMENT,
    name VARCHAR(255), 
    variant_id int,
    product_id int,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (variant_id) REFERENCES variants(id),
    PRIMARY KEY(id)
);

INSERT INTO variant_options VALUES(0, 'Red', 4), (0, 'Blue', 4);
INSERT INTO variant_options VALUES(0, 'M', 5), (0, 'L', 5);

-- CREATE TABLE variant_combi (
--     id int AUTO_INCREMENT,
--     name VARCHAR(255),
--     variant_option_id int,
--     product_entry_id int,
--     FOREIGN KEY (variant_option_id) REFERENCES variant_options(id),
--     FOREIGN KEY (product_entry_id) REFERENCES product_entry(id),
--     PRIMARY KEY(id)
-- );

INSERT INTO variant_combi VALUES (0, "Red", 4, 3, 1);
INSERT INTO variant_combi VALUES (0, "Red", 4, 4, 1);

SELECT pe.name, pe.price, vo.name FROM variant_combi AS vc 
JOIN variant_options AS vo ON vc.variant_option_id = vo.id
JOIN product_entry as pe ON vc.product_entry_id = pe.id;

CREATE TABLE admins(
    id int AUTO_INCREMENT,
    name varchar(150),
    username varchar(24) UNIQUE,
    email varchar(100) UNIQUE,
    password varchar(255),
    gender varchar(20),
    birthdate date,
    PRIMARY KEY (id)
);

INSERT INTO admins VALUES(0, 'Arnel Lopena', 'nel003', 'alopena55555@gmail.com', '$2a$10$tWFWN12D//RYSPP3efSQguqfFNzsdhCrQ9mzoV4F55bPgLwh3uKcy', 'Male', '2003-10-30');

CREATE TABLE admin_tokens(
    id int AUTO_INCREMENT,
    admin_id int,
    token varchar(200) UNIQUE,
    FOREIGN KEY(admin_id) REFERENCES admins(id),
    PRIMARY KEY (id)
);

CREATE TABLE cart(
    id int AUTO_INCREMENT,
    customer_id int,
    product_entry_id int,
    quantity int,
    product_id int,

    FOREIGN KEY(customer_id) REFERENCES customers(id),
    FOREIGN KEY(product_entry_id) REFERENCES product_entry(id),
    FOREIGN KEY(product_id) REFERENCES products(id),
    PRIMARY KEY(id)
);