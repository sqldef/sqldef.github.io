/**
 * @typedef {Object} SchemaExample
 * @property {string} current
 * @property {string} desired
 */

/**
 * @type {Record<string, SchemaExample>}
 */
export const schemaExamples = {
  mysql: {
    current: `CREATE TABLE authors (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
) Engine=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE books (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author_id BIGINT UNSIGNED NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  CONSTRAINT fk_books_author FOREIGN KEY (author_id) REFERENCES authors(id)
) Engine=InnoDB DEFAULT CHARSET=utf8mb4;`,
    desired: `CREATE TABLE authors (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
) Engine=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE books (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author_id BIGINT UNSIGNED NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_books_author FOREIGN KEY (author_id) REFERENCES authors(id),
  CONSTRAINT chk_price CHECK (price > 0),
  CONSTRAINT chk_stock CHECK (stock >= 0),
  INDEX idx_author (author_id),
  INDEX idx_price (price)
) Engine=InnoDB DEFAULT CHARSET=utf8mb4;`,
  },
  postgres: {
    current: `CREATE TABLE authors (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE books (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author_id BIGINT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  CONSTRAINT fk_books_author FOREIGN KEY (author_id) REFERENCES authors(id)
);`,
    desired: `CREATE TABLE authors (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE books (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author_id BIGINT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_books_author FOREIGN KEY (author_id) REFERENCES authors(id),
  CONSTRAINT chk_price CHECK (price > 0),
  CONSTRAINT chk_stock CHECK (stock >= 0)
);

CREATE INDEX idx_books_author ON books(author_id);
CREATE INDEX idx_books_price ON books(price);`,
  },
  sqlite3: {
    current: `CREATE TABLE authors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author_id INTEGER NOT NULL,
  price REAL NOT NULL,
  CONSTRAINT fk_books_author FOREIGN KEY (author_id) REFERENCES authors(id)
);`,
    desired: `CREATE TABLE authors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author_id INTEGER NOT NULL,
  price REAL NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT fk_books_author FOREIGN KEY (author_id) REFERENCES authors(id),
  CONSTRAINT chk_price CHECK (price > 0),
  CONSTRAINT chk_stock CHECK (stock >= 0)
);

CREATE INDEX idx_books_author ON books(author_id);
CREATE INDEX idx_books_price ON books(price);`,
  },
  mssql: {
    current: `CREATE TABLE authors (
  id BIGINT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(255) NOT NULL
);

CREATE TABLE books (
  id BIGINT IDENTITY(1,1) PRIMARY KEY,
  title NVARCHAR(255) NOT NULL,
  author_id BIGINT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  CONSTRAINT fk_books_author FOREIGN KEY (author_id) REFERENCES authors(id)
);`,
    desired: `CREATE TABLE authors (
  id BIGINT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(255) NOT NULL
);

CREATE TABLE books (
  id BIGINT IDENTITY(1,1) PRIMARY KEY,
  title NVARCHAR(255) NOT NULL,
  author_id BIGINT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_books_author FOREIGN KEY (author_id) REFERENCES authors(id),
  CONSTRAINT chk_price CHECK (price > 0),
  CONSTRAINT chk_stock CHECK (stock >= 0)
);

CREATE INDEX idx_books_author ON books(author_id);
CREATE INDEX idx_books_price ON books(price);`,
  },
};
