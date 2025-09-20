/** @jsxImportSource @tiptap/core */

import { Node, mergeAttributes, InputRule, textPasteRule, Extension, minMax, Editor } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { createOption, createPopup, handleKeyDown } from './suggestion-popup'
import './suggestion-popup.css'
import './markdown-file-link.css'
import { match } from 'assert';
import { Transaction } from '@tiptap/pm/state'
import { suggestionData } from '@/components/tiptap-templates/simple/simple-editor'

type MarkdownFileLinkOptions = {
  getItems: () => suggestionData[];
  getPreview: (filePath: string) => Promise<string>;
  suggestion: (props: { getItems: () => suggestionData[] }) => any;
};

function openPopupCallback(getPreview: (filePath: string) => Promise<string>): (event: MouseEvent) => any {
  return (event: MouseEvent) => {
    const link = event.currentTarget as any;
    const filePath = link.attributes.href.value
    getPreview(filePath)
      .then(data => {
        const popup = link.querySelector('div.markdown-file-link-popup');
        // popup.children = [];
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = data;

        popup.textContent = null;
        popup.appendChild(contentDiv);
      });
  }
}

function getSuggestionItems(query: any, getItems: () => suggestionData[]) {
  function distinctBy<T>(array: T[], keyFn: (item: T) => any): T[] {
    return array.filter(
      (item, index, self) =>
        index === self.findIndex((t) => keyFn(t) === keyFn(item))
    )
  }
  const knownFiles: suggestionData[] = getItems();
  const result = knownFiles.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  result.push(...knownFiles.filter(item => {
    if ('path' in item.node) {
      const path = item.node.path as string;
      return path.toLowerCase().includes(query.toLowerCase())
    }
    return false;
  }));
  return distinctBy(result, x => x.name).slice(0, 5);
}

function handleSuggestionCommand({ editor, range, props }: { editor: any, range: { from: number, to: number }, props: { name: string, path?: string, type: string } }) {

  const cursorPosition = editor.state.selection.anchor as number;

  const newRange: { from: number, to: number } = {
    from: Math.min(range.from, cursorPosition),
    to: Math.max(range.to, cursorPosition)
  };
  editor
    .chain()
    .focus()
    .deleteRange(newRange)
    .insertContent({
      type: 'markdownFileLink',
      attrs: {
        href: props.path,
        text: props.name,
        type: props.type
      },
    })
    .run()
}

function renderSuggestionPopup() {
  let popup: HTMLElement | null = null
  let currentCommand: ((props: any) => void) | null = null
  return {
    onStart: ({ items, clientRect, command }: { items: suggestionData[], clientRect: any, command: any }) => {
      currentCommand = command
      popup = createPopup(items, clientRect?.());
    },

    onUpdate: ({ items, clientRect }: { items: suggestionData[], clientRect: any }) => {
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
      getPreview: (filePath: string) => Promise.resolve(""),
      suggestion: (props: { getItems: () => suggestionData[] }) => ({
        char: '#', // Trigger character
        match: /#([\w\-\/\.]+)/,
        getMatch: ({ textBeforeCursor }: { textBeforeCursor: any }) => {
          const match = textBeforeCursor.match(/#([\w\-\/\.]+)/)
          if (!match) return null

          return {
            range: {
              from: textBeforeCursor.length - match[0].length,
              to: textBeforeCursor.length,
            },
            query: match[1],
          }
        },
        items: ({ query }: { query: any }) => {
          return getSuggestionItems(query, props.getItems)
        },
        command: ({ editor, range, props }: { editor: any, range: any, props: { name: string, path?: string, type: string } }) => {
          handleSuggestionCommand({ editor, range, props })
        },
        allow: ({ state, range }: { state: any, range: any }) => true,
        render: () => renderSuggestionPopup(),
      }),
    }
  },

  // onTransaction({ editor, transaction }: { editor: Editor, transaction: Transaction }) {
  //   const allLinks = editor.view.dom.querySelectorAll('a[data-md-link]');

  //   const callback: (event: any) => void =  openPopupCallback(this.options.getPreview);
  //   allLinks.forEach(link => {
  //     link.removeEventListener('mouseenter', callback);
  //     link.addEventListener('mouseenter', callback);
  //   })
  // },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const link = document.createElement('a');
      link.setAttribute('href', node.attrs.href);
      link.setAttribute('data-md-link', node.attrs['data-md-link']);
      link.textContent = node.attrs.text;
      link.classList.add('markdown-file-link');

      const popupTemplate = document.createElement('div');
      popupTemplate.classList.add('markdown-file-link-popup');

      link.appendChild(popupTemplate);

      const mouseEnterCallback = openPopupCallback(this.options.getPreview);

      link.addEventListener('mouseenter', mouseEnterCallback);

      return {
        dom: link,
        destroy() {
          link.removeEventListener('mouseenter', mouseEnterCallback);
        },
      };
    };
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
    const card = ['div', { class: 'markdown-file-link-popup' }];

    return [
      'a',
      mergeAttributes(
        HTMLAttributes, {
        'data-md-link': '',
        href: HTMLAttributes.href,
        class: 'markdown-file-link'
      }),
      HTMLAttributes.text,
      card
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
