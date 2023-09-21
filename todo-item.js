import { SimpleComponent } from "./simple-component.js";

export default class TodoItem extends SimpleComponent {
  constructor() {
    super();
    this.completed = false;
    this.uuid = window.crypto.randomUUID();
  }

  static get observedAttributes() {
    return ["completed", "uuid"];
  }

  observed = {
    completed: (_, newValue) => {
      this.completed = newValue === "true";
    },
    uuid: (_, newValue) => {
      this.uuid = newValue;
    },
  }

  toggle() {
    this.completed = !this.completed;
    this.setAttribute("completed", this.completed);
    const event = new CustomEvent("todo-item:toggle", {
      bubbles: true,
      composed: true,
      detail: { uuid: this.uuid, completed: this.completed },
    });
    this.dispatchEvent(event);
  }

  styles() {
    return this.constructor.css(/* css */`
      .todo-item {
        display: flex;
        align-items: center;
        padding: 8px;
      }
      .todo-item > input {
        margin-right: 8px;
      }
      .todo-item.completed {
        text-decoration: line-through;
        color: #999;
      }
      .todo-item .todo-text {
        user-select: none;
      }
    `);
  }

  template() {
    return this.constructor.html(/* html */`
      <label class="todo-item ${this.completed ? "completed" : ""}">
        <input type="checkbox" data-on:change="toggle" ${this.completed ? "checked" : ""}>
        <span class="todo-text">
          <slot></slot>
        </span>
      </label>
    `);
  }
}

customElements.define("todo-item", TodoItem);
