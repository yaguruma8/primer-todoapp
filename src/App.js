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
