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
    const inputCheckboxElement = todoItemElement.querySelector('.checkbox');
    inputCheckboxElement.addEventListener('change', () => {
      onUpdate({
        id: item.id,
        completed: !item.completed,
      });
    });
    const deleteButtonElement = todoItemElement.querySelector('.delete');
    deleteButtonElement.addEventListener('click', () => {
      onDelete({ id: item.id });
    });
    return todoItemElement;
  }
}
