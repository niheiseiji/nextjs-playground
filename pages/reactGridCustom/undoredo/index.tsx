import React from 'react';
import { NextPage } from 'next';
import "@silevis/reactgrid/styles.css";
import { UndoRedoSample } from '@/components/reactGrid/undoredo/UndoRedoSample';


const ReactGridPage: NextPage = () => {
  return (
    <>
      <h1>undo-redo sample</h1>
      <UndoRedoSample/>
    </>
  );
};

export default ReactGridPage;