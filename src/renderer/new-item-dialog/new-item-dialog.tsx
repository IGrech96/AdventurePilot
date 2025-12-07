import React, { useEffect, useState } from 'react';
import './new-item-dialog.css'; // Optional: for styling

interface Props {
  // onCreate: (projectName: string, targetFolder: string) => void;
  // onCancel: () => void;
}

export const NewItemDialog: React.FC<Props> = () => {
  const [state, setState] = useState({
    name: '',
    canCreate: false
  });

  const handleCancel = () => {
    window.applicationApi.project.sendCreateNewCancelled();
  }

  const handleCreate = () => {
    if (state.name) {
      window.applicationApi.project.sendCreateNew(state.name, "");
    }
  };

  const normilizePath = (path: string): string => {
    return path;
  }

  const updateState = (name: string) => {

    const newItemName = name ?? state.name;
    const canCreate = Boolean(newItemName);

    setState(
      {
        name: newItemName,
        canCreate: canCreate,
      });
  }

  return (
    <div className="project-dialog">
      <h2>Create New Item</h2>
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          value={state.name}
          onChange={(e) => updateState(e.target.value)}
          placeholder="My Awesome Item"
        />
      </div>
      <div className="button-group">
        <button onClick={handleCancel} className="btn cancel">Cancel</button>
        <button onClick={handleCreate} disabled={!state.canCreate} className="btn create">Create</button>
      </div>
    </div>
  );
};
