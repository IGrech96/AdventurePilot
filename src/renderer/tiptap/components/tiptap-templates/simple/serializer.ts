import { renderMarkdown as fileLinkSerializer } from '@/extensions/markdown-file-link/serializer';
import { renderMarkdown as localImagerSerializer } from '@/extensions/local-image/serializer';
import { MarkdownSerializer } from 'prosemirror-markdown'

export function withCustomNodes(editor: any): MarkdownSerializer {
  const defaultMarkdownSerializer = editor?.storage?.markdown?.serializer;

  const advancedSerializer = new MarkdownSerializer(
    {
      ...defaultMarkdownSerializer.nodes,
      markdownFileLink: fileLinkSerializer,
      image: localImagerSerializer,
    },
    defaultMarkdownSerializer.marks
  )

  return advancedSerializer;
}

