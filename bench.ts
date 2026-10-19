// замер на настоящем словаре, запуск: bun run bench.ts words.txt
// в файле по одному слову на строку, кодировка UTF-8
import { Dictionary } from "./src/dictionary.ts";

const path = process.argv[2];
if (!path) {
  console.log("Укажите файл со словами: bun run bench.ts words.txt");
  process.exit(1);
}

const words = (await Bun.file(path).text()).split(/\r?\n/).filter((w) => w.trim() !== "");
const dict = new Dictionary();

let start = performance.now();
dict.addWords(words);
const addTime = performance.now() - start;

start = performance.now();
for (const w of words) dict.has(w);
const hasTime = performance.now() - start;

const letters = words.reduce((sum, w) => sum + w.trim().length, 0);

console.log(`Слов: ${dict.size}`);
console.log(`Букв во всех словах (N): ${letters}`);
console.log(`Узлов в дереве (P): ${dict.nodeCount}, это ${(dict.nodeCount / letters).toFixed(3)} * N`);
console.log(`Память под узлы: ${((dict.nodeCount * 11) / 1e6).toFixed(1)} МБ (11 байт на узел)`);
console.log(`Память с запасом массивов: ${(dict.bytes / 1e6).toFixed(1)} МБ`);
console.log(`Если хранить буквы просто строками: ${((letters * 2) / 1e6).toFixed(1)} МБ (2 байта на букву)`);
console.log(`Добавление всех слов: ${addTime.toFixed(0)} мс`);
console.log(`Проверка одного слова: ${((hasTime * 1e6) / words.length).toFixed(0)} нс в среднем`);
