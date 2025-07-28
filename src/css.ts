let styleCounter = 0;

export function css(strings: TemplateStringsArray, ...values: any[]) {
  const rawCSS = String.raw({ raw: strings }, ...values);
  const uniqueAttr = `data-scope-${styleCounter++}`;

  const scopedCSS = rawCSS.replace(/(^|\})\s*([^{]+)/g, (_, sep, selector: string) => {
    const preparedSelector = selector.trim();

    if (!preparedSelector) {
      return `${sep}\n`;
    }

    // Attach [data-scope] to each selector
    const scopedSelector = preparedSelector
      .split(',')
      .map((sel) => `[${uniqueAttr}] ${sel.trim()}`)
      .join(', ');

    return `${sep}\n${scopedSelector}`;
  });

  const styleTag = document.createElement('style');
  styleTag.textContent = scopedCSS.replaceAll('\n', '').replaceAll(/\s+/g, ' ');
  document.head.appendChild(styleTag);

  return uniqueAttr;
}
