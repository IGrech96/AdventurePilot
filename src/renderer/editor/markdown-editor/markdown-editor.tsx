import { SimpleEditorHandle, suggestionData } from '@/components/tiptap-templates/simple/simple-editor'
import SimpleEditor from '@/components/tiptap-templates/simple/simple-editor'
import './markdown-editor.css'
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { toTipTap } from './json-mapper';
import { useEffect, useRef, useState } from 'react';
import { JSONContent } from '@tiptap/core';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';


function convertToTipTapJson(plainText: string): JSONContent {
  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .parse(plainText);

  const processed = toTipTap(tree, []);

  const text = JSON.stringify(processed, null, 2);

  return processed;
}

export default function MarkdownEditor({ plainText, node }: { plainText?: string, node?: IFileDefinition }) {

  const [suggestions, setSuggestions] = useState<suggestionData[]>([])
  const [jsonContent, setJsonContent] = useState<JSONContent | null>(null);

  const nodeRef = useRef<IFileDefinition>(null);
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
        const newData = data.map(x => ({ name: x.name, node: x }));
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

  useEffect(() => {
    const result = convertToTipTapJson(plainText ?? '');
      setJsonContent(result);
  }, [plainText]);


  const getPreview = async (filePath: string): Promise<string> => {
    const previewData = await window.applicationApi.file.invokeGetFilePreview(filePath);

    const data = await unified()
      .use(remarkParse)         // Parse Markdown to MDAST
      .use(remarkRehype)        // Convert MDAST to HAST
      .use(rehypeStringify)     // Serialize HAST to HTML
      .process(previewData);

    return String(data);
  }

  const handleImageUpload = async (
    file: File,
    onProgress?: (event: { progress: number }) => void,
    abortSignal?: AbortSignal
  ): Promise<string> => {
    // Validate file
    if (!file) {
      throw new Error("No file provided")
    }

    const node = nodeRef.current;
    if (node) {
      const name = file.name;
      const bytes = new Uint8Array(await file.arrayBuffer())
      const data = window.applicationApi.file.invokeSaveItemImage(node, name, bytes);

      data.then(x => {});
      return data;
    }

    throw new Error('Unexpected error');
  }

  return (
    <>
      <SimpleEditor
        ref={editorRef}
        jsonContent={jsonContent}
        onUpdate={onUpdate}
        Suggestions={suggestions}
        getPreview={getPreview}
        uploadImage={handleImageUpload}
      />
    </>
  )
}
