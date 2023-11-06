const DEFAULT_ANIMATION_DURATION = 300;

const parseOptions = options => ({
  delay: options.delay ?? DEFAULT_ANIMATION_DURATION,
  title: options.title ?? "You need to add a data-title to the element",
  placement: options.placement ?? "top",
});

const getRects = (hoverElement, tooltipElement) => ({
  hoverElementRect: hoverElement.getBoundingClientRect(),
  tooltipElementRect: tooltipElement.getBoundingClientRect(),
});

const positionTop = (hoverElement, tooltipElement) => {
  const { hoverElementRect, tooltipElementRect } = getRects(hoverElement, tooltipElement);
  const top = hoverElementRect.top - tooltipElementRect.height - 10;
  const left = hoverElementRect.left - (tooltipElementRect.width / 2 - hoverElementRect.width / 2);

  if (top < 0) {
    return positionBottom();
  }

  tooltipElement.classList.add("top");
  tooltipElement.style.top = `${top}px`;
  tooltipElement.style.left = `${left}px`;
}

const positionRight = (hoverElement, tooltipElement) => {
  const { hoverElementRect, tooltipElementRect } = getRects(hoverElement, tooltipElement);
  const top = hoverElementRect.top - (tooltipElementRect.height / 2 - hoverElementRect.height / 2);
  const left = hoverElementRect.right + 10;

  if (left + tooltipElementRect.width > window.innerWidth) {
    return positionLeft();
  }

  tooltipElement.classList.add("right");
  tooltipElement.style.top = `${top}px`;
  tooltipElement.style.left = `${left}px`;
}

const positionBottom = (hoverElement, tooltipElement) => {
  const { hoverElementRect, tooltipElementRect } = getRects(hoverElement, tooltipElement);
  const top = hoverElementRect.bottom + 10;
  const left = hoverElementRect.left - (tooltipElementRect.width / 2 - hoverElementRect.width / 2);

  if (top + tooltipElementRect.height > window.innerHeight) {
    return positionLeft();
  }

  tooltipElement.classList.add("bottom");
  tooltipElement.style.top = `${top}px`;
  tooltipElement.style.left = `${left}px`;
}

const positionLeft = (hoverElement, tooltipElement) => {
  const { hoverElementRect, tooltipElementRect } = getRects(hoverElement, tooltipElement);
  const top = hoverElementRect.top - (tooltipElementRect.height / 2 - hoverElementRect.height / 2);
  const left = hoverElementRect.left - tooltipElementRect.width - 10;

  if (left < 0) {
    return positionRight();
  }

  tooltipElement.classList.add("left");
  tooltipElement.style.top = `${top}px`;
  tooltipElement.style.left = `${left}px`;
}

const place = (hoverElement, tooltipElement, placement = "top") => {
  switch (placement) {
    case "left":
      return positionLeft(hoverElement, tooltipElement);
    case "right":
      return positionRight(hoverElement, tooltipElement);
    case "bottom":
      return positionBottom(hoverElement, tooltipElement);
    case "top":
    default:
      return positionTop(hoverElement, tooltipElement);
  }
}

const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

const addTooltipToElement = element => {
  const options = parseOptions(element.dataset);

  const tooltip = document.createElement("div");
  tooltip.classList.add("minimal-tooltip", options.placement);
  tooltip.innerText = options.title;
  tooltip.style.transitionDelay = `${options.delay}ms`;
  document.body.appendChild(tooltip);

  place(element, tooltip, options.placement);

  return {
    tooltip,
    options,
  };
};

document.addEventListener("DOMContentLoaded", () => {
  if (isTouchDevice()) {
    return;
  }

  const elementsWithTooltips = document.querySelectorAll("*[data-title]");

  elementsWithTooltips.forEach((element) => {
    element.style.position = "relative";
    const { tooltip, options } = addTooltipToElement(element);

    element.addEventListener("mouseenter", () => {
      tooltip.classList.add("visible");
      tooltip.style.animationDelay = `${options.delay}ms`;
      tooltip.style.animationDuration = `${DEFAULT_ANIMATION_DURATION}ms`;
    });

    element.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");
      tooltip.style.animationDelay = `${DEFAULT_ANIMATION_DURATION}ms`;
      tooltip.style.animationDuration = `${DEFAULT_ANIMATION_DURATION}ms`;
    });
  });
});
