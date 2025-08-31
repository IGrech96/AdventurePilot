import { NodeViewProps } from "@tiptap/core"
import { NodeViewWrapper } from "@tiptap/react";
import React, { useState } from "react"

export const LocalImageNode: React.FC<NodeViewProps> = (props) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [src, setSrc] = useState(props.HTMLAttributes.src);

  if (src.startsWith('/') || src.startsWith('\\')) {
    window.applicationApi.file.invokeGetImageAsBase64(src).then(data => {
      setSrc(`data:image/jpg;base64,${data}`)
    })
  }

  return (
    <NodeViewWrapper>
      <img alt={props.HTMLAttributes.alt} src={src} data-source-src={props.HTMLAttributes.src} title={props.HTMLAttributes.title} />
    </NodeViewWrapper>
  )
}
