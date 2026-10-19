// Словарь на префиксном дереве (Trie)
//
// Если хранить слова просто строками, память уходит на все буквы, это O(N),
// где N - сколько букв во всех словах вместе.
//
// Как работает: каждое слово это путь от корня по буквам.
// У слов с одинаковым началом путь общий, поэтому начало хранится один раз.
// Например у "кот", "кошка", "код" буквы "к" и "о" хранятся один раз на все три.
// Там, где кончается слово, ставим end = 1.
//
// Сначала узлы были объектами с Map, но один узел занимал примерно 240 байт,
// и дерево весило больше, чем просто Set со словами. Поэтому сделала 4 массива,
// номер узла это индекс в них:
// - chars - буква узла, 2 байта
// - firstChild - первый ребёнок, 4 байта
// - nextSibling - следующий ребёнок того же родителя, 4 байта
// - end - кончается ли тут слово, 1 байт
// Получается 11 байт на узел. Узел 0 это корень, поэтому 0 значит "нет узла".
//
// Сложность (L - длина слова, P - сколько узлов в дереве):
// - has O(L), но на каждой букве перебираем детей, их не больше 33, так что до 33 * L сравнений
// - addWord тоже до 33 * L
// - addWords до 33 * N
// - от того, сколько слов уже в словаре, скорость не зависит
// - память O(P), P <= N, в байтах 11 * P
// - массивы растут в 2 раза, поэтому с запасом может быть до 22 * P

const START_CAPACITY = 1024;

export class Dictionary {
  private chars = new Uint16Array(START_CAPACITY);
  private firstChild = new Int32Array(START_CAPACITY);
  private nextSibling = new Int32Array(START_CAPACITY);
  private end = new Uint8Array(START_CAPACITY);
  private count = 1; // узел 0 это корень
  private words = 0;

  // слова сравниваем без учёта регистра и пробелов по краям
  private normalize(word: string): string {
    return word.trim().toLowerCase();
  }

  get size(): number {
    return this.words;
  }

  // сколько узлов без корня
  get nodeCount(): number {
    return this.count - 1;
  }

  // примерно сколько байт занимают массивы
  get bytes(): number {
    return this.chars.length * 11;
  }

  // возвращает true, если слово новое
  addWord(word: string): boolean {
    const w = this.normalize(word);
    if (w === "") return false;

    let node = 0;
    for (let i = 0; i < w.length; i++) {
      const code = w.charCodeAt(i);
      let next = this.findChild(node, code);
      if (next === 0) next = this.addChild(node, code);
      node = next;
    }

    if (this.end[node] === 1) return false; // такое слово уже было
    this.end[node] = 1;
    this.words++;
    return true;
  }

  // возвращает сколько слов было новых
  addWords(list: Iterable<string>): number {
    let added = 0;
    for (const word of list) {
      if (this.addWord(word)) added++;
    }
    return added;
  }

  has(word: string): boolean {
    const w = this.normalize(word);
    if (w === "") return false;

    let node = 0;
    for (let i = 0; i < w.length; i++) {
      node = this.findChild(node, w.charCodeAt(i));
      if (node === 0) return false; // такой буквы дальше нет, значит и слова нет
    }
    return this.end[node] === 1; // путь есть, но это может быть просто начало другого слова
  }

  // идём по детям узла, пока не найдём нужную букву
  private findChild(node: number, code: number): number {
    for (let child = this.firstChild[node]!; child !== 0; child = this.nextSibling[child]!) {
      if (this.chars[child] === code) return child;
    }
    return 0;
  }

  private addChild(node: number, code: number): number {
    if (this.count === this.chars.length) this.grow();

    const child = this.count++;
    this.chars[child] = code;
    this.nextSibling[child] = this.firstChild[node]!; // встаёт первым среди братьев
    this.firstChild[node] = child;
    return child;
  }

  // если места нет, делаем массивы в 2 раза больше и копируем туда
  private grow(): void {
    const size = this.chars.length * 2;

    const chars = new Uint16Array(size);
    chars.set(this.chars);
    this.chars = chars;

    const firstChild = new Int32Array(size);
    firstChild.set(this.firstChild);
    this.firstChild = firstChild;

    const nextSibling = new Int32Array(size);
    nextSibling.set(this.nextSibling);
    this.nextSibling = nextSibling;

    const end = new Uint8Array(size);
    end.set(this.end);
    this.end = end;
  }
}
