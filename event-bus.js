export class EventBus {
  static listeners = {};

  static listen(event, listener) {
    this.listeners[event] ??= [];
    this.listeners[event].push(listener);
  }

  static stopListening(event, listener) {
    if (this.listeners[event] == null) return;
    this.listeners[event] = this.listeners[event].filter(l => l !== listener);
  }

  static emit(event) {
    if (!this.listeners[event.type]) return;
    this.listeners[event.type].forEach(listener => listener.dispatchEvent(event));
  }
}
