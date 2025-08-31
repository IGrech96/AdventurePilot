export function renderMarkdown(state: any, node: any) {
  state.write(`[${node.attrs.text}](${node.attrs.href})`)
}
