
export function createPopup(
  items: { name: string, path: string }[],
  clientRect: DOMRect | null
): HTMLElement {

  const popup = document.createElement('div')
  popup.classList.add('suggestion-popup')

  const activeIndexAttribute = document.createAttribute("data-active-item");
  activeIndexAttribute.value = '0';

  popup.attributes.setNamedItem(activeIndexAttribute);
  // popup.style.position = 'absolute'
  items.forEach((item, index) => {
    const itemElement = createOption(item);
    // if (index === 0){
    //   itemElement.classList.add("active")
    // }
    popup.appendChild(itemElement)
  })

  if (clientRect) {
    popup.style.left = `${clientRect.left}px`
    popup.style.top = `${clientRect.bottom + 5}px`
    document.body.appendChild(popup)
  }

  return popup;
}

export function createOption(item: { name: string, path: string }): HTMLDivElement {
  const option = document.createElement('div')
  option.textContent = item.name
  option.classList.add('suggestion-popup-item');

  const nameAttribute = document.createAttribute('data-name');
  nameAttribute.value = item.name;

  const pathAttribute = document.createAttribute('data-path');
  pathAttribute.value = item.path;

  option.attributes.setNamedItem(nameAttribute);
  option.attributes.setNamedItem(pathAttribute);

  return option;
}

export function handleKeyDown(
  popup: HTMLElement,
  event: KeyboardEvent,
  currentCommand: ((props: any) => void) | null): boolean {
  if (!popup) return false;

  const options = Array.from(popup.children);
  const activeIndex = options.findIndex(x => x.classList.contains('active'));

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    const next = options[activeIndex + 1] || options[0];
    options.forEach(opt => opt.classList.remove('active'));
    if (next) {
      next.classList.add('active');
      next.scrollIntoView({ block: 'nearest' });
      return true;
    }
    return false;
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault();
    const prev = options[activeIndex - 1] || options[options.length - 1];
    options.forEach(opt => opt.classList.remove('active'));
    if (prev) {
      prev.classList.add('active');
      prev.scrollIntoView({ block: 'nearest' });
      return true;
    }
    return false;
  }

  if (event.key === 'Enter') {
    event.preventDefault();
    if (activeIndex >= 0 && currentCommand && options[activeIndex]) {
      const path = options[activeIndex].getAttribute('data-path');
      const name = options[activeIndex].getAttribute('data-name');
      currentCommand({ name: name, path: path });
    }
    return true;
  }

  if (event.key === 'Escape') {
    popup.remove();
    return true;
  }

  return false;
}
