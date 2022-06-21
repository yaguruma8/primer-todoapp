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
