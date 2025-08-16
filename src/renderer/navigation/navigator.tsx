import ProjectTree from "./project-tree"
import type { StoryTreeHandle } from "./project-tree.js"
import NavigationToolbar from "./navigation-toobar.js"
import { useRef } from "react"

export default function Navigator() {
    const storyTreeRef = useRef<StoryTreeHandle>(null);
    return (
        <>
            <NavigationToolbar onCreateNew={() => storyTreeRef.current?.createNew()} />
            <ProjectTree ref={storyTreeRef} />
        </>
    )
}