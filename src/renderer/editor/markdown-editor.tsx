import { SimpleEditorHandle } from '@/components/tiptap-templates/simple/simple-editor'
import SimpleEditor from '@/components/tiptap-templates/simple/simple-editor'
import './markdown-editor.css'
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { toTipTap } from './json-mapper';
import { useEffect, useRef, useState } from 'react';
import path from 'path';

type suggestionData = { name: string, path: string };

export default function MarkdownEditor({ plainText, node }: { plainText?: string, node?: SceneDefinition | OverviewDefinition }) {

  const [suggestions, setSuggestions] = useState<suggestionData[]>([])

  const nodeRef = useRef<SceneDefinition | OverviewDefinition>(null);
  useEffect(() => {
    if (node) {
      nodeRef.current = node;
    }
    else {
      nodeRef.current = null;
    }
    window
      .applicationApi
      .project
      .invokeGetAvailableItems()
      .then(data => {
        const newData = data.map(x => ({ name: x.name, path: x.file }));
        suggestions.length = 0;
        suggestions.push(...newData);
      }
      );

  }, [node]);

  const editorRef = useRef<SimpleEditorHandle>(null);
  const save = () => {
    const markdown = editorRef.current?.getContent();
    const node = nodeRef.current;
    if (markdown && node) {
      window.applicationApi.file.sendSaveMarkdown(markdown, node);
    }
  }

  const onUpdate = () => {
    const node = nodeRef.current;
    if (node) {
      window.applicationApi.file.sendFileChanged(node);
    }
  }

  useEffect(() => {
    window.applicationApi.application.subscribe_onSaveRequest(save);
    return () => window.applicationApi.application.unsubscribe_onSaveRequest(save);
  });

  const tree = unified()
    .use(remarkParse)
    .parse(plainText);

  const processed = toTipTap(tree);

  const text = JSON.stringify(processed, null, 2);

  return (
    <>
      <SimpleEditor
        ref={editorRef}
        jsonContent={processed}
        onUpdate={onUpdate}
        Suggestions={suggestions}
      />
    </>
  )
}
