import { sqldef, getFullVersion } from "./sqldef.mjs";
import { schemaExamples } from "./schema_examples.mjs";

const dbType = document.getElementById("dbType");
const enableDrop = document.getElementById("enableDrop");
const inputA = document.getElementById("inputA");
const inputB = document.getElementById("inputB");
const outputUp = document.getElementById("outputUp");
const errorUp = document.getElementById("errorUp");
const outputDown = document.getElementById("outputDown");
const errorDown = document.getElementById("errorDown");
const versionEl = document.getElementById("version");

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
  const version = await getFullVersion();
  versionEl.textContent = `powered by sqldef v${version}`;
})();
