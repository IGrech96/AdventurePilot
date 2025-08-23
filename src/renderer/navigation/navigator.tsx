import ProjectTree from "./project-tree/project-tree"
import type { StoryTreeHandle } from "./project-tree/project-tree.js"
import NavigationToolbar from "./navigation-toolbar/navigation-toobar.js"
import { useEffect, useRef, useState } from "react"
import { ProjectTreeViewItem } from "./project-tree/project-tree-item";

export default function Navigator() {
    const storyTreeRef = useRef<StoryTreeHandle>(null);

    const [canCreateNewNode, setCanCreateNewNode] = useState(false);
    const [canSave, setCanSave] = useState(false);

    const invokeSave = (event: any) => {
        window.applicationApi.application.sendSaveRequest();
        setCanSave(false);
    }

    useEffect(() => {
        const onItemOpen = (event: any, node: ProjectTreeItem) => {
            if (node.type == 'overview' || node.type == 'location') {
                if (node.path && node.source) {
                    window.applicationApi.file.sendOpenMarkdown(node.path, node.source);
                }
            }

            setCanCreateNewNode(node.type == "location" || node.type == 'locations-root');
            setCanSave(false);
        }
        const onItemChanged = (event: any, node: OverviewDefinition | SceneDefinition) => {
            setCanSave(true);
        }
        const onSaved = (event: any) => {
            setCanSave(false);
        }

        window.applicationApi.project.subscribe_onProjectItemClicked(onItemOpen);
        window.applicationApi.file.subscribe_onFileChanged(onItemChanged);
        window.applicationApi.application.subscribe_onSaveRequest(onSaved);

        return () => {
            window.applicationApi.project.unsubscribe_onProjectItemClicked(onItemOpen);
            window.applicationApi.file.unsubscribe_onFileChanged(onItemChanged);
            window.applicationApi.application.unsubscribe_onSaveRequest(onSaved);
        }
    }, []);

    return (
        <>
            <NavigationToolbar
                onCreateNew={() => storyTreeRef.current?.createNew()}
                canCreate={canCreateNewNode}
                canSave={canSave}
                save={invokeSave}
            />
            <ProjectTree ref={storyTreeRef} />
        </>
    )
}
