export class SimpleComponent extends HTMLElement {
  constructor() {
    super();
    this.eventListenerAbortControllers = [];
    this.attachShadow({ mode: "open" });
  }

  get observed() {
    console.warn("observed not implemented");
    return {};
  }

  styles() {
    console.warn("styles not implemented");
    return null;
  }

  template() {
    console.warn("template not implemented");
    return null;
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    this.detachEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!Object.hasOwn(this.observed, name)) {
      console.warn(`Attribute ${name} was observed, but has no registered callback`);
      return;
    }
    this.observed[name](oldValue, newValue);
    this.render();
  }

  render() {
    this.shadowRoot.replaceChildren(this.template());
    this.shadowRoot.adoptedStyleSheets = [this.styles()];
    this.detachEventListeners();
    this.attachEventListeners();
  }

  attachEventListeners() {
    this.allDescendants.forEach((child) => {
      child.getAttributeNames().filter(it => it.startsWith("data-on:")).forEach((attribute) => {
        const event = attribute.split(":")[1];
        const callback = child.getAttribute(attribute);
        const abortController = new AbortController();
        this.eventListenerAbortControllers.push(abortController);
        child.addEventListener(event, this[callback].bind(this), { signal: abortController.signal });
      });
    });
  }

  detachEventListeners() {
    this.eventListenerAbortControllers.forEach((abortController) => abortController.abort());
    this.eventListenerAbortControllers = [];
  }

  /** All descendant elements, including grandchildren. */
  get allDescendants() {
    return Array.from(this.shadowRoot.querySelectorAll("*"));
  }

  static html(string) {
    const template = document.createElement("template");
    template.innerHTML = string;
    return template.content;
  }

  static css(string) {
    const style = new CSSStyleSheet();
    style.replaceSync(string);
    return style;
  }
}
