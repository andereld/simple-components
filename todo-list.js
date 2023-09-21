import { SimpleComponent } from "./simple-component.js";
import { EventBus } from "./event-bus.js";

export default class TodoList extends SimpleComponent {
  constructor() {
    super();
    this.todos = [];
  }

  get numberOfTodos() {
    return this.todos.length;
  }

  get numberOfCompletedTodos() {
    return this.todos.filter(it => it.completed).length;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("todo-item:toggle", this.toggleItem);
    this.addEventListener("todo-items:replace", this.replaceItems);
    EventBus.listen("todo-items:replace", this);
  }

  toggleItem(event) {
    const { uuid, completed } = event.detail;
    const todo = this.todos.find(it => it.uuid === uuid);
    todo.completed = completed;
    this.render();
  }

  addItem() {
    const text = window.prompt("Enter todo item text");
    if (text == null || text.trim() === "") return;
    this.todos.push({ completed: false, text, uuid: window.crypto.randomUUID() });
    this.render();
  }

  replaceItems(event) {
    this.todos = event.detail;
    this.render();
  }

  styles() {
    return this.constructor.css(/* css */`
      :host {
        font-family: Helvetica;
      }
      .todo-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      .todo-list .header {
        padding: 8px;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #ccc;
      }
      .todo-list .header button {
        padding: 4px 8px;
        font-size: 20px;
        border-radius: 0 8px;
        border: none;
        background-color: #333;
        color: white;
        cursor: pointer;
      }
      .todo-list todo-item:nth-child(odd) {
        background-color: #eee;
      }
    `);
  }

  template() {
    return this.constructor.html(/* html */`
      <div class="todo-list">
        <div class="header">
          <button data-on:click="addItem">+ Add todo item</button>
          <span>${this.numberOfCompletedTodos} / ${this.numberOfTodos}</span>
        </div>
        ${this.todos.map(todo => /* html */`
          <todo-item completed="${todo.completed}" uuid="${todo.uuid}">
            ${todo.text}
          </todo-item>
        `).join("")}
      </div>
    `);
  }
}

customElements.define("todo-list", TodoList);
