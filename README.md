# Primer-todoapp

[JavaScript Primer ユースケース:Todoアプリ](https://jsprimer.net/use-case/todoapp/)

---

# エントリーポイント

## エントリーポイントとは

アプリケーションの中で一番最初に呼び出される部分。    
今回は`index.html`

## モジュール化

JavaScriptの処理をモジュール化し、別々のJavaScriptファイルとして作成する。    
モジュール化は`<script type="module">`で行う。

モジュールは別々のモジュールスコープを持つ。
モジュールスコープはモジュールのトップレベルに作成されるスコープで、グローバルスコープの下に作られる。モジュール同士でスコープが異なるため、それぞれの変数にアクセスできなくなるが、`import`文で読み込むことでモジュール同士の連携が可能になる。


## 最初の構成
```
.
├── index.html
├── index.js
└── src
    └── App.js
```

`index.html`
```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Todo App</title>
  </head>
  <body>
    <h1>Todo App</h1>
    <script src="index.js" type="module"></script>
  </body>
</html>
```

`index.js`    
プロジェクトのエントリーポイント（`index.html`から読み込まれる）
```js
import { App } from './src/App.js'

const app = new App()
```

`src/App.js`   
モジュールのエントリーポイント
```js
console.log("App.js: loaded")

export class App {
  constructor() {
    console.log("App initialized.")
  }
}
```


# アプリの構成要素

## Todoアプリの機能

- Todoアイテムを追加する
- Todoアイテムを更新する
- Todoアイテムを削除する
- Todoアイテム数（合計）を表示する

## アプリの構造をHTMLで定義する
`index.html`
```html
<body>
  <div>
    <!-- 入力フォーム -->
    <form id="js-form">
      <input
        type="text"
        id="js-form-input"
        placeholder="What need to be done?"
        autocomplete="off"
      />
    </form>
    <!-- 入力フォーム -->
    <!-- todoリスト -->
    <div id="js-todo-list"><!--動的に更新されるTodoリスト--></div>
    <!-- todoリスト -->
    <!-- アイテム数 -->
    <footer>
      <span id="js-todo-count">Todoアイテム数: 0</span>
    </footer>
    <!-- アイテム数 -->
  </div>
```

# Todoアイテムの追加を実装する

## Todoアイテムを追加するための操作

- 入力欄にTodoアイテムのタイトルを入力する
  - Todoアイテムのタイトルを取得するために`<input>`から内容を取得する

- 入力欄でエンターキーを押して送信する
  - Enterキーで送信されたことを知るために`<form>`の`submit`イベントを監視する

- TodoリストにTodoアイテムが追加される
  - 入力内容をタイトルにしたTodoアイテムを作成し、TodoリストにTodoアイテム要素を追加する

## 入力内容を取得する
`App.js`
```js
// mount()
const formElement = document.querySelector('#js-form');
const inputElement = document.querySelector('#js-form-input');
// submitイベントを監視
formElement.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log(`入力欄の値: ${inputElement.value}`);
```

## 入力内容をTodoリストに表示する

### HTML文字列からHTML要素を生成するモジュールを追加
`src/view/html-util.js`

### フォームからの送信内容をTodoリストに`<li>`要素として追加する
`src/App.js`
```js
import { element, render } from './view/html-util.js';

export class App {
  constructor() {
    console.log('App initialized.');
  }

  mount() {
    const formElement = document.querySelector('#js-form');
    const inputElement = document.querySelector('#js-form-input');
    const containerElement = document.querySelector('#js-todo-list');
    const todoItemCountElement = document.querySelector('#js-todo-count');

    const todoListElement = element`<ul />`;
    let todoItemCount = 0;
    // inputのsubmitイベントを監視
    formElement.addEventListener('submit', (e) => {
      e.preventDefault();
      // todoアイテム要素を作成
      const todoItemElement = element`<li>${inputElement.value}</li>`;
      // todoリストに追加
      todoListElement.appendChild(todoItemElement);
      // コンテナを上書き
      render(todoListElement, containerElement);
      // アイテム数を追加
      todoItemCount += 1;
      todoItemCountElement.textContent = `Todoアイテム数: ${todoItemCount}`;
      // 入力欄を空文字にする
      inputElement.value = '';
    });
  }
}
```
