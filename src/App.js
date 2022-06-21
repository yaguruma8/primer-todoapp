import { TodoListModel } from './model/TodoListModel.js';
import { TodoItemModel } from './model/TodoItemModel.js';
import { TodoListView } from './view/TodoListView.js';
import { render } from './view/html-util.js';

export class App {
  constructor() {
    console.log('App initialized.');
    this._todoListModel = new TodoListModel();
  }

  handleUpdate({ id, completed }) {
    this._todoListModel.updateTodo({ id, completed });
  }

  handleDelete({ id }) {
    this._todoListModel.deleteTodo({ id });
  }

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
