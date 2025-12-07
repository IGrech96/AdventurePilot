import React, { useEffect, useState } from 'react';
import './new-project-dialog.css'; // Optional: for styling

interface Props {
  // onCreate: (projectName: string, targetFolder: string) => void;
  // onCancel: () => void;
}

export const NewProjectDialog: React.FC<Props> = () => {
  const [state, setState] = useState(
    {
      projectName: '',
      targetFolder: '',
      canCreate: false,
      useProjectNameDirectory: true,
    });

  const onDefaultTargetFolder = (event: any, path: string) => {
    if (state.projectName) {
      const delimeter = path.includes('\\') || path.includes(':') ? '\\' : '/';
      path = path + delimeter + state.projectName
    }
    if (!state.targetFolder)
      updateState({ targetFolder: path })
  };
  useEffect(() => {
    window.applicationApi.file.subscribe_onDefaultProjectFolder(onDefaultTargetFolder);

    return () => {
      window.applicationApi.file.unsubscribe_onDefaultProjectFolder(onDefaultTargetFolder);
    }
  }, [onDefaultTargetFolder]);

  const handleCancel = () => {
    window.applicationApi.project.sendCreateNewCancelled();
  }

  const handleCreate = () => {
    if (state.projectName && state.targetFolder && state.canCreate) {
      window.applicationApi.project.sendCreateNew(state.projectName, state.targetFolder);
    }
  };

  const normilizePath = (path: string): string => {
    return path;
  }

  const updateState = (
    { projectName = null, targetFolder = null, useProjectNameDir = null }:
      { projectName?: string | null, targetFolder?: string | null, useProjectNameDir?: boolean | null }) => {

    const newProjectName = projectName ?? state.projectName;
    let newTargetFolder = targetFolder ?? state.targetFolder;
    const canCreate = Boolean(newProjectName && newTargetFolder);
    let newUseProjectNameDir = useProjectNameDir ?? state.useProjectNameDirectory;

    const delimeter = newTargetFolder.includes('\\') || newTargetFolder.includes(':') ? '\\' : '/';
    const tokens = newTargetFolder.split(delimeter).filter(v => !!v)

    // path before update already contains projectName, remove it
    // and we are changing the not the path
    if (newTargetFolder == state.targetFolder) {
      if (state.useProjectNameDirectory && tokens[tokens.length - 1] == normilizePath(state.projectName)) {
        newTargetFolder = tokens.slice(0, -1).join(delimeter);
      }

      if (newUseProjectNameDir) {
        const projectNameAsPath = normilizePath(newProjectName);
        if (newTargetFolder.endsWith(delimeter)) {
          newTargetFolder = newTargetFolder.slice(0, -1);
        }
        newTargetFolder = [newTargetFolder, projectNameAsPath].join(delimeter);
      }
    }
    else {
      newUseProjectNameDir = false;
    }

    setState(
      {
        projectName: newProjectName,
        targetFolder: newTargetFolder,
        canCreate: canCreate,
        useProjectNameDirectory: newUseProjectNameDir
      });
  }

  return (
    <div className="project-dialog">
      <h2>Create New Story</h2>
      <div className="form-group">
        <label>Project Name</label>
        <input
          type="text"
          value={state.projectName}
          onChange={(e) => updateState({ projectName: e.target.value })}
          placeholder="My Awesome Story"
        />
      </div>
      <div className="form-group">
        <label>Target Folder</label>
        <input
          type="text"
          value={state.targetFolder}
          onChange={(e) => updateState({ targetFolder: e.target.value })}
          placeholder="C:\Projects"
        />
        <div className='checkbox-group'>
          <input
            type='checkbox'
            checked={state.useProjectNameDirectory}
            onChange={(e) => updateState({ useProjectNameDir: e.target.checked })}
          />
          <label>Inlcude Project Name to the path</label>
        </div>
      </div>
      <div className="button-group">
        <button onClick={handleCancel} className="btn cancel">Cancel</button>
        <button onClick={handleCreate} disabled={!state.canCreate} className="btn create">Create</button>
      </div>
    </div>
  );
};
