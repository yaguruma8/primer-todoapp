import { TodoListModel } from './model/TodoListModel.js';
import { TodoItemModel } from './model/TodoItemModel.js';
import { element, render } from './view/html-util.js';

export class App {
  constructor() {
    console.log('App initialized.');
    this._todoListModel = new TodoListModel();
  }

  mount() {
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
