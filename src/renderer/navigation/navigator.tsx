import StoryTree from "./story-tree"
import type { StoryTreeHandle } from "./story-tree"
import NavigationToolbar from "./navigation-toobar"
import { useRef } from "react"

export default function Navigator() {
    const storyTreeRef = useRef<StoryTreeHandle>(null);
    return (
        <>
            <NavigationToolbar onCreateNew={() => storyTreeRef.current?.doSomething()} />
            <StoryTree ref={storyTreeRef} />
        </>
    )
}