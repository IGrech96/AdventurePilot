import { JSONContent } from "@tiptap/core";


// const renameNodeTypes: { source: string, target: string }[] = [
//     { source: "root", target: "doc" },
//     { source: "html", target: "text" },
//     { source: "list", target: "bulletList" },
//     { source: "emphasis", target: "bulletList" },
// ]


const skip = (data: { sourceKey: string, transformedValue: any, targetNode: JSONContent }) => { }

type transformation = {
    selector: (data: { sourceKey: string, sourceNode: JSONContent }) => boolean;
    apply: (data: { sourceKey: string, sourceNode: JSONContent, transformedValue: any, targetNode: JSONContent }) => void;
}

const transformations: transformation[] = [
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
]

export function toTipTap(content: JSONContent): JSONContent {
    const transformed: JSONContent = {}

    for (const key in content) {
        let value = content[key]

        const transformation = transformations.find(x => x.selector({ sourceKey: key, sourceNode: content }));
        if (transformation && transformation.apply === skip) {
            continue;
        }
        let transformedValue;
        if (Array.isArray(value)) {
            transformedValue = value.map(toTipTap)
        }
        else if (typeof value === 'object' && value !== null) {
            transformedValue = toTipTap(value);
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