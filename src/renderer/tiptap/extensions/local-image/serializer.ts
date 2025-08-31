export function renderMarkdown(state: any, node: any) {
  state.write(`![${node.attrs.alt || ''}](${node.attrs['data-source-src'] ?? node.attrs.src})`)
  state.write('\n');
}
