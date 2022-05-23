import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { DEFAULT_NEW_FILENAME, PAGE_TYPE } from '../../const';
import dialogService from '../../ipc/dialog';
import fileSystemService from '../../ipc/filesystem';
import { AppContext } from '../state-provider';

export default function TopBar () {
  const {
    state: {
        sheet,
        currentFile,
        currentDirectory,
        pageType,
      },
      dispatch
} = useContext(AppContext);
async function save () {
  switch (pageType) {
    case PAGE_TYPE.NEW: return saveNew();
    case PAGE_TYPE.DETAIL: return saveDetail();
    default:;
  }
}
async function saveNew () {
  const filePath = await dialogService.showSaveDialogSync({ filters: [{ name: 'Text', extensions: ['txt']}] });
  if (filePath) {
    await fileSystemService.writeFile(filePath, sheet, { encoding: 'UTF-8' });
  }
}
async function saveDetail () {
  await fileSystemService.writeFile(`${currentDirectory}\\${currentFile}`, sheet, { encoding: 'UTF-8' });
  dispatch('setReloadDetailEv');
}
    return <div className="border-b flex justify-between">
        <div className="w-[200px] p-2 flex justify-between">
            <div>
                <Button variant="" className="btn-icon text-xl">
                    <span className="material-symbols-rounded">arrow_back_ios_new</span>
                </Button>
                <Button variant="" className="btn-icon text-xl">
                    <span className="material-symbols-rounded">arrow_forward_ios</span>
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