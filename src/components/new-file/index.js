import { useContext, useEffect, useMemo, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { DEFAULT_NEW_FILENAME, PAGE_TYPE } from '../../const';
import { useQuery } from '../../hook';
import fileSystemService from '../../ipc/filesystem';
import { AppContext } from '../state-provider';

export default function NewFile () {
  const query = useQuery();

    const {
      state: {
          sheet,
        }, 
          dispatch 
  } = useContext(AppContext);

  const [localSheet, setLocalSheet] = useState();

  useEffect(() => {
    dispatch('setPageType', PAGE_TYPE.NEW);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch('setSheet', localSheet);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSheet]);

    console.log(query?.get('import'));
  useEffect(() => {
    if (query?.get('import')) {
      setLocalSheet(sheet);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

    return <div className="flex-1 flex flex-col p-2">
        <h3 className="px-2">
          {DEFAULT_NEW_FILENAME}
        </h3>
        <Form.Control className="border-0 h-full whitespace-nowrap" as="textarea" spellCheck="false" autoFocus value={localSheet} onChange={(e) => setLocalSheet(e.target.value)} />
    </div>;
}