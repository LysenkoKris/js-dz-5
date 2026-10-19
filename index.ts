import { Dictionary } from "./src/dictionary.ts";

const dict = new Dictionary();
let letters = 0; // считаем буквы, чтобы потом сравнить с количеством узлов

function add(words: string[]) {
  let added = 0;
  for (const w of words) {
    if (dict.addWord(w)) {
      added++;
      letters += w.trim().length;
    }
  }
  console.log(`Добавлено новых слов: ${added}`);
}

// разбиваем строку по пробелам и запятым
function splitWords(input: string): string[] {
  return input.split(/[\s,]+/).filter((w) => w !== "");
}

function runAddOne() {
  const word = (prompt("Введите слово:") ?? "").trim();
  if (word === "" || splitWords(word).length > 1) {
    console.log("Ошибка: нужно ввести одно слово");
    return;
  }
  add([word]);
}

function runAddList() {
  const words = splitWords(prompt("Введите слова через пробел или запятую:") ?? "");
  if (words.length === 0) {
    console.log("Ошибка: список пустой");
    return;
  }
  add(words);
}

function runHas() {
  const word = (prompt("Какое слово проверить?") ?? "").trim();
  if (word === "") {
    console.log("Ошибка: нужно ввести слово");
    return;
  }
  console.log(dict.has(word) ? `Слово "${word}" есть в словаре` : `Слова "${word}" нет в словаре`);
}

function runStats() {
  console.log(`Слов: ${dict.size}`);
  console.log(`Букв во всех словах (N): ${letters}`);
  console.log(`Узлов в дереве (P): ${dict.nodeCount}`);
  console.log(`Памяти под дерево: ${dict.bytes} байт`);
}

while (true) {
  console.log("1 - Добавить слово");
  console.log("2 - Добавить список слов");
  console.log("3 - Проверить слово");
  console.log("4 - Статистика");
  console.log("0 - Выход");

  const choice = prompt("Выберите пункт:");

  if (choice === "1") runAddOne();
  else if (choice === "2") runAddList();
  else if (choice === "3") runHas();
  else if (choice === "4") runStats();
  else if (choice === "0" || choice === null) break;
  else console.log("Нет такого пункта");
}
