import { useContext, useEffect, useMemo, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { PAGE_TYPE } from '../../const';
import fileSystemService from '../../ipc/filesystem';
import { AppContext } from '../state-provider';

export default function FileDetail () {
  let { fileName } = useParams();
    const {
      state: {
          sheet,
          currentDirectory,
          reloadDetailEv,
        }, 
          dispatch 
  } = useContext(AppContext);

  const [currentContentFile, setCurrentContentFile] = useState();

  const isChangeContent = useMemo(() => sheet !== currentContentFile, [sheet, currentContentFile]);
  
  useEffect(() => {
    dispatch('setPageType', PAGE_TYPE.DETAIL);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch('setCurrentFile', fileName);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileName]);

  useEffect(() => {
    (async () => {
      console.log(fileName);
      const content = await fileSystemService.readFile(`${currentDirectory}\\${fileName}`, { encoding: 'UTF-8' });
      console.log(content);
      setCurrentContentFile(content);
      dispatch('setSheet', content);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileName, reloadDetailEv]);

    return <div className="flex-1 flex flex-col">
        <h4 className="px-2 mt-2">
          {fileName}
          { isChangeContent && <span className="text-neutral-500">*</span> }
        </h4>
        <textarea className="border-0 h-full whitespace-nowrap p-2" as="textarea" spellCheck="false" value={sheet} onChange={(e) => dispatch('setSheet', e.target.value)} ></textarea>
    </div>;
}