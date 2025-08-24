import { Node, mergeAttributes, InputRule, textPasteRule, Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { createOption, createPopup, handleKeyDown } from './suggestion-popup'
import './suggestion-popup.css'

type data = { name: string; path: string };

type MarkdownFileLinkOptions = {
  getItems: () => data[];
  suggestion: (props: { getItems: () => data[] }) => any;
};

function getSuggestionItems(query: any, getItems: () => data[]) {
  function distinctBy<T>(array: T[], keyFn: (item: T) => any): T[] {
    return array.filter(
      (item, index, self) =>
        index === self.findIndex((t) => keyFn(t) === keyFn(item))
    )
  }
  const knownFiles: data[] = getItems();
  const result = knownFiles.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  result.push(...knownFiles.filter(item => item.path.toLowerCase().includes(query.toLowerCase())));
  return distinctBy(result, x => x.name).slice(0, 5);
}

function handleSuggestionCommand({ editor, range, props }: { editor: any, range: any, props: data }) {
  editor
    .chain()
    .focus()
    .deleteRange(range)
    .insertContent({
      type: 'markdownFileLink',
      attrs: {
        href: props.path,
        text: props.name,
      },
    })
    .run()
}

function renderSuggestionPopup() {
  let popup: HTMLElement | null = null
  let currentCommand: ((props: any) => void) | null = null
  return {
    onStart: ({ items, clientRect, command }: { items: data[], clientRect: any, command: any }) => {
      currentCommand = command
      popup = createPopup(items, clientRect?.());
    },

    onUpdate: ({ items, clientRect }: { items: data[], clientRect: any }) => {
      if (!popup) return
      popup.innerHTML = ''
      items.forEach(item => {
        popup!.appendChild(createOption(item));
      })

      const rect = clientRect?.()
      if (rect) {
        popup.style.left = `${rect.left}px`
        popup.style.top = `${rect.bottom + 5}px`
      }
    },

    onExit: () => {
      if (popup && popup.parentNode) {
        popup.parentNode.removeChild(popup)
        popup = null
      }
    },

    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (!popup) return false;
      return handleKeyDown(popup, event, currentCommand);
    },
  }
}

export const MarkdownFileLink = Node.create<MarkdownFileLinkOptions>({
  name: 'markdownFileLink',

  inline: true,
  group: 'inline',
  atom: true,

  addAttributes() {
    return {
      href: {
        default: null,
      },
      text: {
        default: null,
      },
    }
  },

  addOptions() {
    return {
      getItems: () => [],
      suggestion: (props: { getItems: () => data[] }) => ({
        char: '#', // Trigger character
        items: ({ query }: { query: any }) => {
          return getSuggestionItems(query, props.getItems)
        },
        command: ({ editor, range, props }: { editor: any, range: any, props: data }) => handleSuggestionCommand({ editor, range, props }),
        allow: ({ state, range }: { state: any, range: any }) => true,
        render: () => renderSuggestionPopup(),
      }),
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion({
          getItems: this.options.getItems
        }),
      }),
    ]
  },

  parseHTML() {
    return [
      {
        tag: 'a[data-md-link]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'a',
      mergeAttributes(
        HTMLAttributes, {
        'data-md-link': '',
        href: HTMLAttributes.href,
        class: 'markdown-file-link'
      }),
      HTMLAttributes.text
    ]
  },

  addInputRules() {
    return [
      new InputRule({
        find: /#([\w\-\/\.]+\.md)/g,
        handler: ({ state, range, match, commands, chain, can }) => {
          const path = match[1]
          chain()
            .deleteRange(range)
            .insertContent({
              type: 'markdownFileLink',
              attrs: {
                href: `/files/${path}`,
                text: path,
              },
            })
            .run()
        }
      }),
    ]
  },

})
