import { sqldef, getVersion } from "./sqldef_browser.mjs";

const dbType = document.getElementById("dbType");
const enableDrop = document.getElementById("enableDrop");
const inputA = document.getElementById("inputA");
const inputB = document.getElementById("inputB");
const outputUp = document.getElementById("outputUp");
const errorUp = document.getElementById("errorUp");
const outputDown = document.getElementById("outputDown");
const errorDown = document.getElementById("errorDown");

const schemaExamples = {
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

async function runDiff() {
  // Run up diff (current -> desired)
  errorUp.classList.add("hidden");
  try {
    const result = await sqldef(
      dbType.value,
      inputB.value,
      inputA.value,
      enableDrop.checked
    );
    outputUp.textContent = result;
    outputUp.className = "language-sql";
    Prism.highlightElement(outputUp);
  } catch (e) {
    outputUp.innerHTML = "&nbsp;";
    errorUp.classList.remove("hidden");
    errorUp.innerHTML = e.message;
  }

  // Run down diff (desired -> current)
  errorDown.classList.add("hidden");
  try {
    const result = await sqldef(
      dbType.value,
      inputA.value,
      inputB.value,
      enableDrop.checked
    );
    outputDown.textContent = result;
    outputDown.className = "language-sql";
    Prism.highlightElement(outputDown);
  } catch (e) {
    outputDown.innerHTML = "&nbsp;";
    errorDown.classList.remove("hidden");
    errorDown.innerHTML = e.message;
  }
}

dbType.addEventListener("change", () => {
  const examples = schemaExamples[dbType.value];
  if (examples) {
    inputA.value = examples.current;
    inputB.value = examples.desired;
  }
  runDiff();
});

inputA.addEventListener("input", runDiff);
inputB.addEventListener("input", runDiff);
enableDrop.addEventListener("change", runDiff);

// Populate textareas and run diff on initial load
const initialExamples = schemaExamples[dbType.value];
if (initialExamples) {
  inputA.value = initialExamples.current;
  inputB.value = initialExamples.desired;
}
runDiff();

// Display version info
(async () => {
  const version = await getVersion();
  const versionEl = document.getElementById("version");
  if (versionEl) {
    versionEl.textContent = `powered by sqldef v${version}`;
  }
})();
