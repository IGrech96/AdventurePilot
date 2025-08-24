import { renderMarkdown } from '@/extensions/markdown-file-link';
import { Editor } from '@tiptap/core'
import { MarkdownSerializer } from 'prosemirror-markdown'

export function withCustomNodes(editor: any): MarkdownSerializer {
  const defaultMarkdownSerializer = editor?.storage?.markdown?.serializer;

  const advancedSerializer = new MarkdownSerializer(
    {
      ...defaultMarkdownSerializer.nodes,
      markdownFileLink: renderMarkdown
    },
    defaultMarkdownSerializer.marks
  )

  return advancedSerializer;
}

