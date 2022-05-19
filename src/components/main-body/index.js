import { Button, Form } from 'react-bootstrap';
import cn from 'classnames';
import text_file from '../../assets/images/text_file.png';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../state-provider';

export default function MainBody () {
    const {
      state: {
          sheet,
          currentContentFile,
          currentFile,
        }, 
          dispatch 
  } = useContext(AppContext);

  useEffect(() => {
    dispatch('setSheet', currentContentFile);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentContentFile]);

    return <div className="flex-1 flex flex-col p-2">
        <h3 className="px-2">{currentFile}</h3>
        <Form.Control className="border-0 h-full whitespace-nowrap" as="textarea" spellCheck="false" value={sheet} onChange={(e) => dispatch('setSheet', e.target.value)} />
    </div>;
}