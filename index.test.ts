import { describe, expect, test } from "bun:test";
import { Dictionary } from "./src/dictionary.ts";

describe("Dictionary", () => {
  test("добавление одного слова и проверка", () => {
    const dict = new Dictionary();
    expect(dict.addWord("кот")).toBe(true);
    expect(dict.has("кот")).toBe(true);
    expect(dict.has("кит")).toBe(false);
    expect(dict.size).toBe(1);
  });
  test("добавление списка слов", () => {
    const dict = new Dictionary();
    expect(dict.addWords(["кот", "кошка", "код", "дом"])).toBe(4);
    ["кот", "кошка", "код", "дом"].forEach((w) => expect(dict.has(w)).toBe(true));
    expect(dict.size).toBe(4);
  });
  test("начало слова это ещё не слово", () => {
    const dict = new Dictionary();
    dict.addWord("кошка");
    expect(dict.has("кош")).toBe(false);
    expect(dict.has("кошкам")).toBe(false);
    dict.addWord("кош");
    expect(dict.has("кош")).toBe(true);
  });
  test("повторное слово не добавляется второй раз", () => {
    const dict = new Dictionary();
    expect(dict.addWords(["дом", "дом", "ДОМ"])).toBe(1);
    expect(dict.addWord("дом")).toBe(false);
    expect(dict.size).toBe(1);
  });
  test("регистр и пробелы по краям не важны", () => {
    const dict = new Dictionary();
    dict.addWord("  Москва ");
    expect(dict.has("москва")).toBe(true);
    expect(dict.has("МОСКВА")).toBe(true);
  });
  test("пустые слова", () => {
    const dict = new Dictionary();
    expect(dict.addWord("")).toBe(false);
    expect(dict.addWord("   ")).toBe(false);
    expect(dict.has("")).toBe(false);
    expect(dict.size).toBe(0);
  });
  test("пустой словарь", () => {
    expect(new Dictionary().has("слово")).toBe(false);
  });
  test("ё и е это разные буквы", () => {
    const dict = new Dictionary();
    dict.addWord("ёж");
    expect(dict.has("ёж")).toBe(true);
    expect(dict.has("еж")).toBe(false);
  });
  test("общие начала хранятся один раз", () => {
    const dict = new Dictionary();
    dict.addWords(["кот", "кошка", "код"]); // 3 + 5 + 3 = 11 букв
    // к, о, т, ш, к, а, д -> 7 узлов вместо 11 букв
    expect(dict.nodeCount).toBe(7);
  });
  test("узлов не больше, чем букв, на случайных словах", () => {
    const alphabet = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
    const words = Array.from({ length: 2000 }, () =>
      Array.from({ length: 2 + Math.floor(Math.random() * 8) }, () => alphabet[Math.floor(Math.random() * 33)]).join(""),
    );
    const dict = new Dictionary();
    dict.addWords(words);

    const letters = words.reduce((sum, w) => sum + w.length, 0);
    expect(dict.nodeCount).toBeLessThanOrEqual(letters);
    words.forEach((w) => expect(dict.has(w)).toBe(true));
    expect(dict.size).toBe(new Set(words).size);
  });
});
