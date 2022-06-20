let todoIndex = 0;

export class TodoItemModel {
  constructor({ title, completed }) {
    this.id = todoIndex++;
    this.title = title;
    this.completed = completed;
  }
}
