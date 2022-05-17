import { Button, Form } from 'react-bootstrap';
import cn from 'classnames';
import text_file from '../../assets/images/text_file.png';
import { useContext, useState } from 'react';
import { AppContext } from '../state-provider';

export default function MainBody () {
    const {
      state: {
          sheet,
          currentFile,
        }, 
          dispatch 
  } = useContext(AppContext);

    return <div className="flex-1 p-2">
        <h3>{currentFile}</h3>
        <Form.Control className="border-0 h-full" as="textarea" spellCheck="false" value={sheet} onChange={(e) => dispatch('setSheet', e.target.value)} />
    </div>;
}