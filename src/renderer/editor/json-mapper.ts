import { JSONContent } from "@tiptap/core";
import type { Root } from 'mdast'

const skip = (data: { sourceKey: string, transformedValue: any, targetNode: JSONContent }) => { }

type attributeTransformation = {
  selector: (data: { sourceKey: string, sourceNode: JSONContent }) => boolean;
  apply: (data: { sourceKey: string, sourceNode: JSONContent, transformedValue: any, targetNode: JSONContent }) => void;
}

type nodeTransformation = {
  selector: (data: { sourceNode: JSONContent }) => boolean;
  apply: (data: { sourceNode: JSONContent, targetNode: JSONContent }) => void | Promise<void>;
}

const toTipTapAttributeTransformation: attributeTransformation[] = [
  //Skip
  { selector: (data) => data.sourceKey === 'position', apply: skip },
  { selector: (data) => data.sourceKey === 'checked', apply: skip },
  { selector: (data) => data.sourceKey === 'spread', apply: skip },

  //rename node
  { selector: (data) => data.sourceKey === 'children', apply: (data) => data.targetNode['content'] = data.transformedValue },
  { selector: (data) => data.sourceKey === 'value', apply: (data) => data.targetNode['text'] = data.transformedValue },
  {
    selector: (data) => data.sourceKey === 'depth', apply: (data) => {
      data.targetNode.attrs ??= {};
      data.targetNode.attrs.level = data.transformedValue;
    }
  },

  //rename type
  { selector: (data) => data.sourceNode.type === 'root', apply: (data) => data.targetNode.type = 'doc' },
  { selector: (data) => data.sourceNode.type === 'html', apply: (data) => data.targetNode.type = 'text' },
  { selector: (data) => data.sourceNode.type === 'list', apply: (data) => data.targetNode.type = 'bulletList' },
];

const toTipTapNodeTransformation: nodeTransformation[] = [
  //special case
  {
    selector: (data) => data.sourceNode.type === 'emphasis', apply: (data) => {
      data.targetNode.type = 'text';
      data.targetNode.marks ??= [];
      data.targetNode.marks.push({
        type: "italic",
      });
      const sourceContent = data.sourceNode.children;
      if (sourceContent) {
        data.targetNode.text = sourceContent[0].value
        data.sourceNode.content = undefined;
      }
    }
  },
  {
    selector: (data) => data.sourceNode.type === 'strong', apply: (data) => {
      data.targetNode.type = 'text';
      data.targetNode.marks ??= [];
      data.targetNode.marks.push({
        type: "bold",
      });
      const sourceContent = data.sourceNode.children;
      if (sourceContent) {
        data.targetNode.text = sourceContent[0].value
        data.sourceNode.content = undefined;
      }
    }
  },
  {
    selector: (data) => data.sourceNode.type === 'inlineCode', apply: (data) => {
      data.targetNode.type = 'text';
      data.targetNode.marks ??= [];
      data.targetNode.marks.push({
        type: "code",
      });
      data.targetNode.text = data.sourceNode.value;
    }
  },
  {
    selector: (data) => data.sourceNode.type === 'code', apply: (data) => {
      data.targetNode.type = 'codeBlock';
      data.targetNode.attrs ??= {};
      data.targetNode.attrs.language = data.sourceNode.lang;
      data.targetNode.content ??= []
      if (data.sourceNode.value) {
        data.targetNode.content.push({
          type: "text",
          text: data.sourceNode.value
        })
      }
      data.sourceNode.value = undefined;
    }
  },
  {
    selector: (data) => data.sourceNode.type === 'link', apply: (data) => {

      const text = data.sourceNode.children[0].value;
      const href = data.sourceNode.url;

      if (href && href.endsWith('.md')) {
        data.targetNode.type = 'markdownFileLink';
        data.targetNode.attrs ??= {};
        data.targetNode.attrs.href = href;
        data.targetNode.attrs.text = text;
      }
      else {
        data.targetNode.type = 'text';
        data.targetNode.marks ??= [];
        data.targetNode.marks.push({
          type: 'link',
          attrs: {
            "href": href,
            "target": "_blank",
            "rel": "noopener noreferrer nofollow",
            "class": null
          }
        });
      }
      data.targetNode.text = text;

      data.sourceNode.children = undefined;
    }
  },
  {
    selector: (data) => data.sourceNode.type === 'image', apply: async (data) => {

      const sourceSrc = data.sourceNode.url;
      let src = sourceSrc;
      const alt = data.sourceNode.alt;
      const title = data.sourceNode.title;

      if (src){
        const encoded = await window.applicationApi.file.invokeGetImageAsBase64(src);
        src = `data:image/jpg;base64,${encoded}`
      }

      data.targetNode.type = 'image';
      data.targetNode.attrs ??= {};
      data.targetNode.attrs.src = src;
      data.targetNode.attrs.sourceSrc = sourceSrc;
      data.targetNode.attrs.alt = alt;
      data.targetNode.attrs.title = title;

      data.sourceNode.children = undefined;
    }
  },
]

export async function toTipTap(content: JSONContent): Promise<JSONContent> {
  const transformed: JSONContent = {}

  const nodeTransformation = toTipTapNodeTransformation.find(x => x.selector({ sourceNode: content }));
  if (nodeTransformation) {
    const res = nodeTransformation.apply({ sourceNode: content, targetNode: transformed })
    if (res instanceof Promise )
    {
      await res;
    }
    return transformed;
  }
  for (const key in content) {
    let value = content[key]

    const transformation = toTipTapAttributeTransformation.find(x => x.selector({ sourceKey: key, sourceNode: content }));
    if (transformation && transformation.apply === skip) {
      continue;
    }
    let transformedValue;
    if (Array.isArray(value)) {
      transformedValue = await Promise.all(value.map(toTipTap))
    }
    else if (typeof value === 'object' && value !== null) {
      transformedValue = await toTipTap(value);
    }
    else {
      transformedValue = value;
    }
    if (transformation) {
      transformation.apply({ sourceKey: key, sourceNode: content, transformedValue: transformedValue, targetNode: transformed })
    }
    else {
      transformed[key] = transformedValue;
    }
  }
  return transformed
}
