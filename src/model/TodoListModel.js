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

  addTodo(todoItem) {
    this._items.push(todoItem);
    this.emit('change');
  }

  updateTodo({ id, completed }) {
    const todoItem = this._items.find((todo) => todo.id === id);
    if (!todoItem) {
      return;
    }
    todoItem.completed = completed;
    this.emit('change');
  }

  deleteTodo({ id }) {
    this._items = this._items.filter((todo) => todo.id !== id);
    this.emit('change')
  }
}
