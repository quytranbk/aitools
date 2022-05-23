import cn from 'classnames';
import { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import text_file from '../../assets/images/text_file.png';
import dialogService from '../../ipc/dialog';
import fileSystemService from '../../ipc/filesystem';
import { getFileExt } from '../../utils';
import { AppContext } from '../state-provider';

export default function LeftBar () {
  let navigate = useNavigate();
  let { fileName } = useParams();
  const { state: { currentFile }, dispatch } = useContext(AppContext);
  const [fileList, setFileList] = useState();
  
  useEffect(() => {
      // (async function () {
      //     const a = await fileSystemService.readFile('C:\\Users\\QJS\\Downloads\\sungha_jung-river_flows_in_you.xml', {encoding: 'UTF-8'});
      //     console.log(a);
      // })();
  }, []);

  async function handleOpenDir () {
    // dialog open
    // fs open dir
    // set state file list
    const dirPaths = await dialogService.showOpenDialogSync({ properties: ['openDirectory'] });
    console.log(dirPaths);
    if (dirPaths) {
      dispatch('setCurrentDirectory', dirPaths[0]);
      const readDirResult = await fileSystemService.readdir(dirPaths[0]);
      if (readDirResult) {
      let fileList = [];
      for (const name of readDirResult) {
        const isFile = await fileSystemService.isFile(`${dirPaths}\\${name}`);
        if (isFile && getFileExt(name) === 'txt') {
          fileList.push(name);
        }
      }
      setFileList(fileList);

      }
    }

  }
  async function handleLoadFile (name) {
    navigate(`./${name}`);
  }

  function handleOpenNewFile () {
    navigate(`./new`);
  }

    return <div className="border-r w-[200px] flex flex-col">
        <div className="flex justify-between items-center px-4 pr-2 py-2">
            <label className="form-label">Danh sách</label>
            <div>
            <Button variant="" className="btn-icon text-xl" onClick={handleOpenNewFile}>
                <span className="material-symbols-rounded">add</span>
            </Button>
            <Button variant="" className="btn-icon text-xl" onClick={handleOpenDir}>
                <span className="material-symbols-rounded">format_list_bulleted</span>
            </Button>
            </div>
        </div>
        <div className="px-2 flex-1 min-h-0 overflow-y-auto">
            {fileList?.map((name, index) =>
                <div 
                key={index}
                className={cn('cursor-pointer px-2 py-1', { 'bg-blue-100 border border-blue-200 font-bold': fileName === name })} 
                onClick={() => handleLoadFile(name)}
                >
                    <div className="text-black">
                    <img src={text_file} alt="" />
                        {name}
                        </div>
                </div>
            )}
        </div>
    </div>;
}