import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import './markdown-editor.css'
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { toTipTap } from './json-mapper';

export default function MarkdownEditor({plainText}:{plainText: string}) {

  const tree = unified()
  .use(remarkParse)
  .parse(plainText);

  const processed = toTipTap(tree);

  const text = JSON.stringify(processed, null, 2) 
  return (
    <>
    <SimpleEditor jsonContent={processed} />
    </>
  )
}