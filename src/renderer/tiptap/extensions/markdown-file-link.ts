import { Node, mergeAttributes, InputRule, textPasteRule } from '@tiptap/core'
import { EditorState, Transaction } from '@tiptap/pm/state'

export const MarkdownFileLink = Node.create({
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

  parseHTML() {
    return [
      {
        tag: 'a[data-md-link]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['a', mergeAttributes(HTMLAttributes, { 'data-md-link': '', href: HTMLAttributes.href }), HTMLAttributes.text]
  },

  // return [
  //   {
  //     // Matches #path/to/file.md
  //     find: /#([\w\-\/\.]+\.md)/g,
  //     handler: ({ match, chain }) => {
  //       const path = match[1]
  //       return chain()
  //         .insertContent({
  //           type: 'markdownLink',
  //           attrs: {
  //             href: `/files/${path}`,
  //             text: path,
  //           },
  //         })
  //         .run()
  //     },
  //   },
  // ]
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
