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
}
