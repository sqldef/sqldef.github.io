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
    current: `CREATE TABLE users (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(128) DEFAULT 'konsumer'
) Engine=InnoDB DEFAULT CHARSET=utf8mb4;`,
    desired: `CREATE TABLE users (
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(128) DEFAULT 'konsumer',
created_at DATETIME NOT NULL
) Engine=InnoDB DEFAULT CHARSET=utf8mb4;`,
  },
  postgres: {
    current: `CREATE TABLE users (
id BIGSERIAL PRIMARY KEY,
name VARCHAR(128) DEFAULT 'konsumer'
);`,
    desired: `CREATE TABLE users (
id BIGSERIAL PRIMARY KEY,
name VARCHAR(128) DEFAULT 'konsumer',
created_at TIMESTAMP NOT NULL
);`,
  },
  sqlite3: {
    current: `CREATE TABLE users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT DEFAULT 'konsumer'
);`,
    desired: `CREATE TABLE users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT DEFAULT 'konsumer',
created_at TEXT NOT NULL
);`,
  },
  mssql: {
    current: `CREATE TABLE users (
id BIGINT IDENTITY(1,1) PRIMARY KEY,
name NVARCHAR(128) DEFAULT 'konsumer'
);`,
    desired: `CREATE TABLE users (
id BIGINT IDENTITY(1,1) PRIMARY KEY,
name NVARCHAR(128) DEFAULT 'konsumer',
created_at DATETIME NOT NULL
);`,
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

// Run diff on initial load
runDiff();

// Display version info
(async () => {
  const version = await getVersion();
  const versionEl = document.getElementById("version");
  if (versionEl) {
    versionEl.textContent = `powered by sqldef v${version}`;
  }
})();
