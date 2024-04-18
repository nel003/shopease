

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
    category_id int,
    description TEXT,
    status int DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    PRIMARY KEY(id)
);

CREATE TABLE variant_types (
    id int  AUTO_INCREMENT,
    type_name VARCHAR(255),
    product_id int,
    FOREIGN KEY (product_id) REFERENCES products(id),
    PRIMARY KEY(id)
);

CREATE TABLE variants (
    id int AUTO_INCREMENT,
    variant_type_id int,
    variant_name VARCHAR(255),
    stocks int NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    FOREIGN KEY(variant_type_id) REFERENCES variant_types(id), 
    PRIMARY KEY (id)
);