import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_NEW_FILENAME, PAGE_TYPE } from '../../const';
import dialogService from '../../ipc/dialog';
import fileSystemService from '../../ipc/filesystem';
import { getFileExt } from '../../utils';
import { AppContext } from '../state-provider';

export default function TopBar() {
  let navigate = useNavigate();
  const {
    state: {
      sheet,
      currentFile,
      currentDirectory,
      pageType,
    },
    dispatch
  } = useContext(AppContext);
  async function save() {
    switch (pageType) {
      case PAGE_TYPE.NEW: return saveNew();
      case PAGE_TYPE.DETAIL: return saveDetail();
      default: ;
    }
  }
  async function saveNew() {
    const filePath = await dialogService.showSaveDialogSync({ filters: [{ name: 'Text', extensions: ['txt'] }] });
    if (filePath) {
      await fileSystemService.writeFile(filePath, sheet, { encoding: 'UTF-8' });
    }
  }
  async function saveDetail() {
    await fileSystemService.writeFile(`${currentDirectory}\\${currentFile}`, sheet, { encoding: 'UTF-8' });
    dispatch('setReloadDetailEv');
  }

  
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
      dispatch('setFileList', fileList);

      }
    }

  }

  function handleOpenNewFile () {
    navigate(`./new?date=${Date.now()}`);
  }
  return <div className="border-b flex justify-between">
    <div className="w-[200px] p-2 flex justify-between">
      <div>
        
            <Button variant="" className="btn-icon text-xl mr-1" title="Mở thư mục" onClick={handleOpenDir}>
                <span className="material-symbols-rounded">format_list_bulleted</span>
            </Button>
      <Button variant="" className="btn-icon text-xl" title="Tạo mới" onClick={handleOpenNewFile}>
                <span className="material-symbols-rounded">add</span>
            </Button>
      </div>
    </div>
    <div className="p-2 flex-1 flex justify-between items-center">
      <div>
        {/* <span>than van he.txt</span> */}
      </div>
      <div>
        <Button variant="primary" onClick={save}>Lưu</Button>
      </div>
    </div>
  </div>
}