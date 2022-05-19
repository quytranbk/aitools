import React, { useContext } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TIME_NODE_MAP } from '../../const';
import { DATA_FILE_XML } from '../../data';
import dialogService from '../../ipc/dialog';
import fileSystemService from '../../ipc/filesystem';
import { findMap } from '../../utils';
import { AppContext } from '../state-provider';
import { xml2js } from 'xml-js';

export default function Header() {
  const { dispatch } = useContext(AppContext);

  async function openFile() {
    try {
      const filePaths = await dialogService.showOpenDialogSync({ properties: ['openFile'] });
      if (filePaths) {
        const content = await fileSystemService.readFile(`${filePaths[0]}`, { encoding: 'UTF-8'});
        return content;
      }
      return;
    } catch(e) {
      return;
    }
  }
  async function importFile () {
    const content = await openFile();
    if(!content) {
      return;
    }
    const contentObj = (xml2js(content, { compact: true }));
    console.log(contentObj);
    const reducedXmlNoteList = contentObj['score-partwise']?.part?.measure?.reduce((barAcc, bar) => {
      const reduceNote = bar.note.reduce((acc, note) => {
        if (note.notations?.technical?.string) {
          if (checkTieType(note.tie, 'stop')) {
            findLatestTieBeginAndMerge(acc, note) || findLatestTieBeginAndMerge(barAcc, note);
            return acc;
          }
          return [
            ...acc,
            {
              type: note.type?._text,
              tie: note.tie,
              chord: !!note.chord,
              dot: !!note.dot,
              ...note.notations?.technical,
            }
          ];
        }
        return acc;
      }, []);
      return [
        ...barAcc,
        ...reduceNote
      ];
    }, []);
    // console.log(reducedXmlNoteList);
    if (reducedXmlNoteList) {
      const a = buildGuitarSheet(reducedXmlNoteList);
      dispatch('setSheet', a);
    }
  }
  
  function checkTieType(tie, type) {
    return Array.isArray(tie) ? true : tie?._attributes?.['type'] === type;
  }
  function findLatestTieBeginAndMerge(acc, note) {
    const { string, fret } = note.notations.technical;
    let findedEl;
    for (let index = acc.length - 1; index >= 0; index--) {
      const el = acc[index];
      if (checkTieType(el.tie, 'start') && el.string?._text === string?._text && el.fret?._text === fret?._text) {
        findedEl = el;
        break;
      }
      
    }
    // const findedEl = acc.reverse().find(el => checkTieType(el.tie, 'start') && el.string === string && el.fret === fret);
    if (findedEl) {
      findedEl.type = `${findedEl.type} ${note.type}`;
      return true;
    }
    return;
  }

  function buildGuitarSheet (list) {
    return list.reduce((acc, element, index) => {
      if (element.chord) {
        const lastItemAcc = acc[acc.length - 1];
        lastItemAcc.chords = lastItemAcc.chords || [];
        lastItemAcc.chords.push(element);
        return acc;
      }
      return [
        ...acc,
        element
      ];
    }, [])
    .map(element => {
      const num = caculateNum(element.type);
      const stringNote = caculateNoteString(element);
      return `${stringNote}${num}`;
    })
    .join(' ');
  }
  function caculateNum (type) {
    const sumRatio = type.split(' ').reduce((acc, el) => {
      // console.log(findMap(TIME_NODE_MAP, 'type', el));
      return acc + (findMap(TIME_NODE_MAP, 'type', el)?.ratioWithBlackNode || 0);
    }, 0);
    const findedMap = TIME_NODE_MAP.find(el => sumRatio / el.ratioWithBlackNode >= 1 && sumRatio / el.ratioWithBlackNode < 2 );
    const num = findedMap ? findedMap.num + (sumRatio / findedMap.ratioWithBlackNode - 1) : 0;
    return num < 0 ? num : `+${num}`;
  }
  
  function caculateNoteString (element) {
    return (element.chords ? [...element.chords, element] : [element]).map(el => {if(!el.string?._text) console.log(el); return `${el.string?._text}${el.fret?._text}`}).join('=');
  }

  return <header className="px-2 relative flex bg-[#f0f0f0] border-b border-b-[#cccccc] border-t border-t-[#cccccc]">
    {/* <div className="absolute inset-0 flex justify-center items-center">
      <img className="w-[24px] h-[24px]" src={apple} alt="" />
    </div> */}
    
    <Dropdown>
                <Dropdown.Toggle as={React.forwardRef(({ onClick }, ref) => (
                        
                  <div
                    className="py-[6px] flex text-[1.45rem] font-medium cursor-pointer"
                    ref={ref}
                    onClick={(e) => {
                      e.preventDefault();
                      onClick(e);
                    }}
                  >
                    <div>"ai"</div>
                    <div className="text-black text-opacity-40 ml-1">Tools</div>
                  </div>
                    ))
                    } id="dropdown-custom-components">
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item eventKey="1" onClick={importFile}>Import</Dropdown.Item>
                        <Dropdown.Item eventKey="2" >Thoát</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
    <div className="flex-1"></div>
    {/* <Navbar bg="light" className="px-4">
      <Navbar.Brand href="#" className="flex">
          <div>nmgh</div>
          <div className="text-black text-opacity-30 ml-1">Tools</div>
          </Navbar.Brand>
  </Navbar> */}
    <div>
    </div>
  </header>;
}