const parseOptions = o => {
  let content = "You need to add content to the tooltip by using the data-tooltip attribute";
  let options = {};

  try {
    options = JSON.parse(o);
    content = options.content || content;
  } catch (error) {
    content = o;
  }

  return {
    delay: options.delay || 300,
    content,
    placement: options.placement || "top",
  }
};

class TooltipElement {
  #options;

  #hoverElementRect;

  #tooltipElement;
  #tooltipElementRect;

  constructor(hoverElement) {
    this.#options = parseOptions(hoverElement.dataset.tooltip);
    this.#hoverElementRect = hoverElement.getBoundingClientRect();

    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    document.body.appendChild(tooltip);

    this.#tooltipElement = tooltip;
    this.#tooltipElement.innerHTML = this.#options.content;
    this.#tooltipElementRect = tooltip.getBoundingClientRect();
    this.#place();
  }

  #positionTop() {
    const top = this.#hoverElementRect.top - this.#tooltipElementRect.height - 10;
    const left = this.#hoverElementRect.left - (this.#tooltipElementRect.width / 2 - this.#hoverElementRect.width / 2);

    if (top < 0) {
      return this.#positionBottom();
    }

    this.#tooltipElement.classList.add("top");
    this.#tooltipElement.style.top = `${top}px`;
    this.#tooltipElement.style.left = `${left}px`;
  }

  #positionRight() {
    const top = this.#hoverElementRect.top - (this.#tooltipElementRect.height / 2 - this.#hoverElementRect.height / 2);
    const left = this.#hoverElementRect.right + 10;

    if (left + this.#tooltipElementRect.width > window.innerWidth) {
      return this.#positionLeft();
    }

    this.#tooltipElement.classList.add("right");
    this.#tooltipElement.style.top = `${top}px`;
    this.#tooltipElement.style.left = `${left}px`;
  }

  #positionBottom() {
    const top = this.#hoverElementRect.bottom + 10;
    const left = this.#hoverElementRect.left - (this.#tooltipElementRect.width / 2 - this.#hoverElementRect.width / 2);

    if (top + this.#tooltipElementRect.height > window.innerHeight) {
      return this.#positionLeft();
    }

    this.#tooltipElement.classList.add("bottom");
    this.#tooltipElement.style.top = `${top}px`;
    this.#tooltipElement.style.left = `${left}px`;
  }

  #positionLeft() {
    const top = this.#hoverElementRect.top - (this.#tooltipElementRect.height / 2 - this.#hoverElementRect.height / 2);
    const left = this.#hoverElementRect.left - this.#tooltipElementRect.width - 10;

    if (left < 0) {
      return this.#positionRight();
    }

    this.#tooltipElement.classList.add("left");
    this.#tooltipElement.style.top = `${top}px`;
    this.#tooltipElement.style.left = `${left}px`;
  }

  #place() {
    switch (this.#options.placement) {
      case "left":
        return this.#positionLeft();
      case "right":
        return this.#positionRight();
      case "bottom":
        return this.#positionBottom();
      case "top":
      default:
        return this.#positionTop();
    }
  }

  get delay() {
    return this.#options.delay;
  }

  show() {
    this.#tooltipElement.style.opacity = 1;
  }

  hide() {
    this.#tooltipElement.style.opacity = 0;
  }

  remove() {
    this.#tooltipElement.remove();
  }
}

class Queue {
  constructor() {
    this._elements = [];
  }

  add(hoverElement) {
    const tooltip = new TooltipElement(hoverElement);

    this._elements.push({
      timeoutId: window.setTimeout(() => {
        tooltip.show();
      }, tooltip.delay),
      tooltip,
    });
  }

  remove() {
    const lastItem = this._elements.pop();

    lastItem.tooltip.hide();
    window.setTimeout(() => {
      window.clearTimeout(lastItem.timeoutId);
      lastItem.tooltip.remove();
    }, 300);
  }
}

class Tooltip {
  constructor(tooltipOptions = {}) {
    const elementsWithTooltips = document.querySelectorAll(tooltipOptions.selector || "*[data-tooltip]");

    this.queue = new Queue();

    elementsWithTooltips.forEach((element) => {
      element.addEventListener("mouseenter", (event) => {
        this.queue.add(event.target);
      });

      element.addEventListener("mouseleave", () => {
        this.queue.remove();
      });
    });
  }
}

new Tooltip();
