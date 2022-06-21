import { element } from './html-util.js';
import { TodoItemView } from './TodoItemView.js';

export class TodoListView {
  constructor() {}

  createElement(todoItems, { onUpdate, onDelete }) {
    const todoListElement = element`<ul />`;
    todoItems.forEach((item) => {
      const todoItemView = new TodoItemView();
      const todoItemElement = todoItemView.createElement(item, {
        onUpdate,
        onDelete,
      });
      todoListElement.appendChild(todoItemElement);
    });
    return todoListElement;
  }
}
