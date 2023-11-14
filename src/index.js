const DEFAULT_TOOLTIP_SELECTOR = "data-title";
const DEFAULT_ANIMATION_DURATION = 300;

const tooltipPlacement = {
  TOP: "top",
  RIGHT: "right",
  BOTTOM: "bottom",
  LEFT: "left",
};

const parseOptions = options => ({
  delay: options.delay ?? DEFAULT_ANIMATION_DURATION,
  title: options.title ?? `You need to add a ${DEFAULT_TOOLTIP_SELECTOR} to the element`,
  placement: options.placement ?? tooltipPlacement.TOP,
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

  tooltipElement.classList.add(tooltipPlacement.TOP);
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

  tooltipElement.classList.add(tooltipPlacement.RIGHT);
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

  tooltipElement.classList.add(tooltipPlacement.BOTTOM);
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

  tooltipElement.classList.add(tooltipPlacement.LEFT);
  tooltipElement.style.top = `${top}px`;
  tooltipElement.style.left = `${left}px`;
}

const place = (hoverElement, tooltipElement, placement = tooltipPlacement.TOP) => {
  switch (placement) {
    case tooltipPlacement.LEFT:
      return positionLeft(hoverElement, tooltipElement);
    case tooltipPlacement.RIGHT:
      return positionRight(hoverElement, tooltipElement);
    case tooltipPlacement.BOTTOM:
      return positionBottom(hoverElement, tooltipElement);
    case tooltipPlacement.TOP:
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

const handleMouseEnter = (tooltip, options) => () => {
  console.log("handleMouseEnter");
  tooltip.classList.add("visible");
  tooltip.style.animationDelay = `${options.delay}ms`;
  tooltip.style.animationDuration = `${DEFAULT_ANIMATION_DURATION}ms`;
};

const handleMouseLeave = tooltip => () => {
  tooltip.classList.remove("visible");
  tooltip.style.animationDelay = `${DEFAULT_ANIMATION_DURATION}ms`;
  tooltip.style.animationDuration = `${DEFAULT_ANIMATION_DURATION}ms`;
};

const processTooltip = element => {
  element.style.position = "relative";
  const { tooltip, options } = addTooltipToElement(element);

  element.addEventListener("mouseenter", handleMouseEnter(tooltip, options));
  element.addEventListener("mouseleave", handleMouseLeave(tooltip));
};

const observer = new MutationObserver(mutations => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        if (node.hasAttribute(`${DEFAULT_TOOLTIP_SELECTOR}`)) {
          processTooltip(node);
        }

        node.querySelectorAll(`*[${DEFAULT_TOOLTIP_SELECTOR}]`).forEach(processTooltip);
      });
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (isTouchDevice()) {
    return;
  }

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  document.querySelectorAll(`*[${DEFAULT_TOOLTIP_SELECTOR}]`).forEach(processTooltip);
});
