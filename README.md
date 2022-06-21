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

## ここまでのディレクトリ構成
```
.
├── index.html
├── index.js
└── src
    ├── App.js
    └── view
        └── html-util.js
```
## 課題

多くのウェブアプリはなんらかのイベントをリッスンして表示を更新する。    
このようにイベントが発生しtことを元に処理を進める方法を**イベント駆動・イベントドリブン**と呼ぶ。

イベントでTodoリスト要素を**直接HTML要素として追加**するのは、
- （長所）コードは短く書ける
- （短所）DOMのみにしか状態が残らないため柔軟性がなくなる

短所はDOM操作を頻繁に行うWebアプリの場合は問題になることが多いため、これを解決する必要がある。

# イベントとモデル

## DOMを直接操作する場合の問題

直接DOMを更新すると、TodoリストにTodoアイテムが何個あるか、どんなTodoがあるかなどの情報がDOM上にしか存在しない。    
この状態でTodoアイテムの状態を更新（削除）などするためには、HTML要素にTodoアイテムの情報（id、タイトルなど）を全て埋め込む必要がある。    
また一つの操作に対して二つ以上の箇所の表示が更新される場合などに処理が複雑化していくことが予想される。    


### DOMを直接操作する場合の機能と表示の関係

| 機能 | 操作 | 表示 |
| - | - | - |
| Todoアイテムの追加 | フォームを入力して送信 | Todoリスト`#js-todo-list`にTodoアイテム要素を小要素として追加。<br>あわせて`#js-todo-count`を更新。 |
| Todoアイテムの更新 | チェックボックスをクリック | Todoリスト`#js-todo-list`にある指定したアイテム要素のチェック状態を更新 |
| Todoアイテムの削除 | 削除ボタンをクリック | Todoリスト`#js-todo-list`にある指定したTodoアイテム要素を削除。<br>あわせて`#js-todo-count`を更新。 |

## モデルを導入する

Todoリスト、Todoアイテムという情報をJavaScriptで扱うことができるようにする＝**モデル化**

モデルとは、**モノの状態や操作方法を定義したオブジェクト**

データはプロパティで持ち、メソッドでデータを操作する。

### モデルを導入した場合の機能と表示の関係

| 機能 | 操作 | モデルの処理 | 表示 |
| - | - | - | - |
| Todoアイテムの追加 | フォームを入力して送信 | `TodoListModel`に新しい`TodoItemModel`を追加| `TodoListModel`を元に状態を更新 |
| Todoアイテムの更新 | チェックボックスをクリック | `TodoListModel`の指定した`TodoItemModel`の状態を更新 | `TodoListModel`を元に状態を更新 |
| Todoアイテムの削除 | 削除ボタンをクリック | `TodoListModel`から指定した`TodoItemModel`を削除 | `TodoListModel`を元に状態を更新 |

表示はモデルの状態を元にHTML要素を作成して更新する＝モデルの状態が変化していなければ表示は変わらない。

表示の更新のタイミングは、
- DOM直接更新の場合...フォームを操作したタイミング（＝フォームのイベントをリッスンする）
- モデルを導入した場合...モデルの状態が変化したタイミング

なので、モデルの状態が変化したことを表示側から知る（表示側がモデルをリッスンする）必要がある。    
そのためにモデルにイベントを導入する。

## モデルの変化を伝えるイベント

DOM直接更新の場合、フォームの`submit`イベントが発火したら実行する関数を`addEventListener()`で登録していた。    
同じように、モデルがイベントを発火させたら実行する関数を登録できるようにすればいい。    

イベントとは、
- イベントを発生させる側（ディスパッチ、またはエミット）
- イベントをリッスンする側（イベントリスナー）

の二つの面から成り立つ。

## EventEmitter

イベントの仕組みを持ったクラス`EventEmitter`を作成し、`TodoListModel`はそれを継承することによってイベントの機能を持たせる。

`src/EventEmitter.js`
```js
export class EventEmitter {
  constructor() {
    this._listeners = new Map();
  }
  // イベントリスナーを登録する
  addEventListener(type, listener) {
    if (!this._listeners.has(type)) {
      this._listeners.set(type, new Set());
    }
    const listenerSet = this._listeners.get(type);
    listenerSet.add(listener);
  }
  // typeのイベントを発火させ、イベントリスナーを実行する
  emit(type) {
    const listenerSet = this._listeners.get(type);
    if (!listenerSet) {
      return;
    }
    listenerSet.forEach((listener) => {
      listener.call(this);
    });
  }
  // イベントリスナーを削除する
  removeEventListener(type, listener) {
    const listenerSet = this._listeners.get(type)
    if (!listenerSet) {
      return
    }
    listenerSet.forEach(ownlistener => {
      if (ownlistener === listener) {
        listenerSet.delete(listener)
      }
    })
  }
}
```

## EventEmitterを継承したTodoListModel

- `TodoItemModel` : Todoアイテムを表現するクラス
- `TodoListModel` : Todoリストを表現するモデル　複数のTodoアイテムを保持する

`TodoItemModel`を`TodoListModel`に追加、更新、削除した時に表示を更新する。   
なので、`TodoListModel`にイベントの機能を持たせ、

- `TodoListModel`は変更があったら自分自身に対してイベントを発火させる
- `TodoListModel`のイベントをあらかじめリッスンし、イベントが発火したら表示を変更する

という流れで実装する。

`src/model/TodoItemModel.js`
```js
let todoIndex = 0

export class TodoItemModel {
  constructor({title, completed}) {
    this.id = todoIndex++;
    this.title = title
    this.completed = completed
  }
}
```

`src/model/TodoListModel.js`
```js
import { EventEmitter } from '../EventEmitter.js';

export class TodoListModel extends EventEmitter {
  constructor(items = []) {
    super();
    this._items = items;
  }

  getTotalCount() {
    return this._items.length;
  }

  getTodoItems() {
    return this._items;
  }
  // todoItemを追加するメソッド
  addTodo(todoItem) {
    this._items.push(todoItem);
    // 追加の処理が終わったら'change'イベントを発火する
    this.emit('change');
  }
}
```

## モデルを使って表示を更新する
`src/App.js`
```js
export class App {
  constructor() {
    console.log('App initialized.');
    this._todoListModel = new TodoListModel();
  }

  mount() {
    // 要素の取得
    const formElement = document.querySelector('#js-form');
    const inputElement = document.querySelector('#js-form-input');
    const containerElement = document.querySelector('#js-todo-list');
    const todoItemCountElement = document.querySelector('#js-todo-count');

    // TodoListModelをリッスンし、イベントが発火したら表示を更新する
    this._todoListModel.addEventListener('change', () => {
      // todoList要素の作成
      const todoListElement = element`<ul />`;
      // todoItem要素を作成してtodoList要素に追加する
      const todoItems = this._todoListModel.getTodoItems();
      todoItems.forEach((item) => {
        const todoItemElement = element`<li>${item.title}</li>`;
        todoListElement.appendChild(todoItemElement);
      });
      // コンテナ要素にtodoList要素を追加する
      render(todoListElement, containerElement);
      // アイテム数の表示を更新する
      todoItemCountElement.textContent = `Todoアイテム数: ${this._todoListModel.getTotalCount()}`;
      console.log('done.')
    });

    // 入力formをリッスンし、イベントが発火したら新しいTodoItemModelを追加する
    formElement.addEventListener('submit', (e) => {
      e.preventDefault();
      this._todoListModel.addTodo(
        new TodoItemModel({
          title: inputElement.value,
          completed: false,
        })
      );
      // 入力欄を戻す
      inputElement.value = '';
    });
  }
}
```

## ここまでのディレクトリ構成
```
.
├── index.html
├── index.js
└── src
    ├── App.js
    ├── EventEmitter.js
    ├── model
    │   ├── TodoItemModel.js
    │   └── TodoListModel.js
    └── view
        └── html-util.js
```

# Todoアイテムの更新と削除を実装する

## Todoアイテムの更新

Todoアイテムの更新はTodoアイテムに`<input type="checkbox">`をつけて、
- checked属性あり : 完了(todoItem.completed = true)
- checked属性なし : 未完了(todoItem.completed = false)

とする。

### 実装

- チェックボックスの`change`イベントをリッスンするイベントリスナーを設定する
  - チェックボックスをクリックした時`change`イベントが発火される
- チェックボックスのイベントが発火したら該当するidの`TodoItemModel`の`completed`を変更する
  - `TodoListModel`から操作する
- `TodoListModel` `TodoItemModel`の更新が完了したら自分自身に`change`イベントを発火させる
- `TodoListModel`のイベントが発火したら表示を更新する

`src/App.js`
```js
// 省略
    // TodoListModelをリッスンし、イベントが発火したら表示を更新する
    this._todoListModel.addEventListener('change', () => {
      const todoListElement = element`<ul />`;
      const todoItems = this._todoListModel.getTodoItems();
      todoItems.forEach((item) => {
        // completedの状態によって表示を変更する
        const todoItemElement = item.completed
          ? element`<li><input type="checkbox" class="checkbox" checked><s>${item.title}</s></li>`
          : element`<li><input type="checkbox" class="checkbox">${item.title}</li>`;
        // アイテムのチェックボックスを取得してリスナーを設定する
        const inputCheckboxElement = todoItemElement.querySelector('.checkbox');
        inputCheckboxElement.addEventListener('change', () => {
          // チェックの付け外し＝completedの状態が反転 idと一緒に渡してTodoListModelの状態を変更する
          this._todoListModel.updateTodo({
            id: item.id,
            completed: !item.completed,
          });
        });
        todoListElement.appendChild(todoItemElement);
      });
      // コンテナ要素にtodoList要素を追加する
      render(todoListElement, containerElement);
      // アイテム数の表示を更新する
      todoItemCountElement.textContent = `Todoアイテム数: ${this._todoListModel.getTotalCount()}`;
    });
```

`src/model/TodoListModel.js`
```js
// 省略
  updateTodo({ id, completed }) {
    // 指定したidのtodoItemを抽出
    const todoItem = this._items.find((todo) => todo.id === id);
    // todoItemが存在しない場合
    if (!todoItem) {
      return;
    }
    // completedを変更したら`change`イベントを発火させる
    todoItem.completed = completed;
    this.emit('change');
  }
```

## Todoアイテムの削除

Todoアイテムの削除は、todoItemに`<button>`をつけて、`click`イベントが発火したらそのアイテムを削除するようにする。

### 実装

- `<button>`要素の`click`イベントをリッスンするイベントリスナーを設定する
- `click`イベントが発火したら該当するidの`TodoItemModel`を`TodoListModel`のitemsから取り除く
- `TodoListModel`は自分の更新が終わったら`change`イベントを発火させる
- `TodoListModel`のイベントが発火したら表示を更新する

`src/App.js`
```js
// 省略
    // TodoListModelをリッスンし、イベントが発火したら表示を更新する
    this._todoListModel.addEventListener('change', () => {
      const todoListElement = element`<ul />`;
      const todoItems = this._todoListModel.getTodoItems();
      todoItems.forEach((item) => {
        const todoItemElement = item.completed
          ? element`
            <li>
              <input type="checkbox" class="checkbox" checked><s>${item.title}</s>
              <button class="delete">X</button>
            </li>`
          : element`
            <li>
              <input type="checkbox" class="checkbox">${item.title}
              <button class="delete">X</button>
            </li>`;
        // アイテムの更新のリスナー
        const inputCheckboxElement = todoItemElement.querySelector('.checkbox');
        inputCheckboxElement.addEventListener('change', () => {
          this._todoListModel.updateTodo({
            id: item.id,
            completed: !item.completed,
          });
        });
        // アイテムの削除のリスナー
        const deleteButtonElement = todoItemElement.querySelector('.delete');
        // クリックしたらTodoListModelから該当するidのtodoItemを削除するメソッドを呼ぶ
        deleteButtonElement.addEventListener('click', () => {
          this._todoListModel.deleteTodo({ id: item.id });
        });
        
        todoListElement.appendChild(todoItemElement);
      });
      // コンテナ要素にtodoList要素を追加する
      render(todoListElement, containerElement);
      // アイテム数の表示を更新する
      todoItemCountElement.textContent = `Todoアイテム数: ${this._todoListModel.getTotalCount()}`;
    });
```

`src/model/TodoListModel.js
```js
  deleteTodo({ id }) {
    // 指定のid以外のtodoItemをフィルター＝指定のidを外す
    // 操作が終了したら`change`イベントを発火させる
    this._items = this._items.filter((todo) => todo.id !== id);
    this.emit('change')
  }
```
# Todoアプリのリファクタリング

現状ではApp.jsにHTML要素の作成処理が多く、見通しがあまり良くない。    
`App.js`は本来、
- Modelの初期化
- HTML要素とModelのイベントの中継
という役割なので、その役割に集中できるようにする。

そのためにHTML要素の作成処理を`View`として分離する。

## Viewコンポーネント
HTML要素の作成は、
- 各todoItem
- todoItemをまとめるTodoList

から成り立つので、この二つをそれぞれ、`TodoItemView`、`TodoListView`としてコンポーネント化する。

todoアイテムの`<input type="checkbox">`の`change`イベント、`<button>`の`click`イベントは、発火した時に`TodoListModel`を変更するため、リスナー関数を`App`から渡すようにする。

`src/view/TodoItemView.js`
```js
import { element } from './html-util.js';

export class TodoItemView {
  constructor() {}

  createElement(item, { onUpdate, onDelete }) {
    const todoItemElement = item.completed
      ? element`
      <li>
        <input type="checkbox" class="checkbox" checked><s>${item.title}</s>
        <button class="delete">X</button>
      </li>`
      : element`
      <li>
        <input type="checkbox" class="checkbox">${item.title}
        <button class="delete">X</button>
      </li>`;
    // チェックボックスのリスナーを設定
    const inputCheckboxElement = todoItemElement.querySelector('.checkbox');
    inputCheckboxElement.addEventListener('change', () => {
      // App -> TodoListView -> TodoItemView に渡されるリスナー関数を設定
      onUpdate({
        id: item.id,
        completed: !item.completed,
      });
    });
    // 削除ボタンのリスナーを設定
    const deleteButtonElement = todoItemElement.querySelector('.delete');
    deleteButtonElement.addEventListener('click', () => {
      onDelete({ id: item.id });
    });
    return todoItemElement;
  }
}
```

`src/view/TodoListView.js`
```js
import { element } from './html-util.js';
import { TodoItemView } from './TodoItemView.js';

export class TodoListView {
  constructor() {}

  createElement(todoItems, { onUpdate, onDelete }) {
    const todoListElement = element`<ul />`;
    todoItems.forEach((item) => {
      const todoItemView = new TodoItemView();
      const todoItemElement = todoItemView.createElement(item, {
        // App -> TodoListView に渡されて、TodoItemViewに渡すリスナー関数
        onUpdate,
        onDelete,
      });
      todoListElement.appendChild(todoItemElement);
    });
    return todoListElement;
  }
}
```
`src/App.js`
```js
// 省略
    this._todoListModel.addEventListener('change', () => {
      const todoListView = new TodoListView();
      const todoListElement = todoListView.createElement(
        this._todoListModel.getTodoItems(),
        {
          // App -> TodoListView -> TodoItemView と渡していくリスナー関数
          onUpdate: ({ id, completed }) => {
            this._todoListModel.updateTodo({ id, completed });
          },
          onDelete: ({ id }) => {
            this._todoListModel.deleteTodo({ id });
          },
        }
      );
      render(todoListElement, containerElement);
      todoItemCountElement.textContent = `Todoアイテム数: ${this._todoListModel.getTotalCount()}`;
    });
```


## Appコンポーネントで管理されるイベントリスナー

| no | イベントの流れ | リスナー関数 | 役割 |
| - | - | - | - |
| 1 | Model -> View | this._todoListModel.addEventListener('change') | TodoListModelのイベントを受けとって描画を更新 |
| 2 | View -> Model | formElement.addEventListener('submit') | フォームから入力完了イベントを受け取る |
| 3 | View -> Model | onUpdate | todoアイテムのチェックボックスのchangeイベントを受け取る |
| 4 | View -> Model | onDelete | todoアイテムの削除ボタンのclickイベントを受け取る |

(2)〜(4)はいずれもViewからModelを変更するためのリスナー関数    
これらがTodoアプリの扱っている機能であることをわかりやすくするため、リスナー関数を`App`クラスのメソッドとして定義し直す。

`src/App.js`
```js
export class App {
  constructor() {
    console.log('App initialized.');
    this._todoListModel = new TodoListModel();
  }
  // アイテムの更新
  handleUpdate({ id, completed }) {
    this._todoListModel.updateTodo({ id, completed });
  }
  // アイテムの削除
  handleDelete({ id }) {
    this._todoListModel.deleteTodo({ id });
  }
  // アイテムの追加
  handleAdd(title) {
    this._todoListModel.addTodo(
      new TodoItemModel({
        title,
        completed: false,
      })
    );
  }

  mount() {
    const formElement = document.querySelector('#js-form');
    const inputElement = document.querySelector('#js-form-input');
    const containerElement = document.querySelector('#js-todo-list');
    const todoItemCountElement = document.querySelector('#js-todo-count');

    // TodoListModelをリッスンし、イベントが発火したら表示を更新する
    this._todoListModel.addEventListener('change', () => {
      const todoListView = new TodoListView();
      const todoListElement = todoListView.createElement(
        this._todoListModel.getTodoItems(),
        {
          onUpdate: ({ id, completed }) => {
            this.handleUpdate({ id, completed });
          },
          onDelete: ({ id }) => {
            this.handleDelete({ id });
          },
        }
      );
      // コンテナ要素にtodoList要素を追加する
      render(todoListElement, containerElement);
      // アイテム数の表示を更新する
      todoItemCountElement.textContent = `Todoアイテム数: ${this._todoListModel.getTotalCount()}`;
    });

    // 入力formをリッスンし、イベントが発火したら新しいTodoItemModelを追加する
    formElement.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAdd(inputElement.value);
      inputElement.value = '';
    });
  }
}
```
