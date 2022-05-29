import React, { useContext } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TIME_NODE_MAP } from '../../const';
import { DATA_FILE_XML } from '../../data';
import dialogService from '../../ipc/dialog';
import fileSystemService from '../../ipc/filesystem';
import { findMap } from '../../utils';
import { AppContext } from '../state-provider';
import { xml2js } from 'xml-js';
import { useNavigate } from 'react-router-dom';
import apple from '../../assets/images/apple.png';

export default function Header() {
  const { dispatch } = useContext(AppContext);
  let navigate = useNavigate();

  async function openFile() {
    try {
      const filePaths = await dialogService.showOpenDialogSync({ properties: ['openFile'] });
      if (filePaths) {
        const content = await fileSystemService.readFile(`${filePaths[0]}`, { encoding: 'UTF-8' });
        return content;
      }
      return;
    } catch (e) {
      console.log('error');
      return;
    }
  }
  async function importFile() {
    const content = await openFile();
    if (!content) {
      console.log('error');
      return;
    }
    const contentObj = (xml2js(content, { compact: true }));
    const reducedXmlNoteList = contentObj['score-partwise']?.part?.measure?.reduce((barAcc, bar) => {
      const reduceNote = bar?.note?.reduce((acc, note) => {
        if (note.notations?.technical?.string) {
          const isStopType = checkTieType(note.tie, 'stop');
          // if (idhqdn
          return [
            ...acc,
            {
              mute: isStopType,
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
      if (reduceNote) {
        reduceNote[0].firstNoteOfBar = true;
      }
      return [
        ...barAcc,
        ...(reduceNote || [])
      ];
    }, []);
    console.log(reducedXmlNoteList);
    if (reducedXmlNoteList) {
      const outputSheet = buildGuitarSheet(reducedXmlNoteList);

      dispatch('setSheet', outputSheet);
      navigate(`./new?import=true&date=${Date.now()}`);
    }
  }

  function checkTieType(tie, type) {
    return Array.isArray(tie) ? true : tie?._attributes?.['type'] === type;
  }
  // function findLatestTieBeginAndMerge(acc, note) {
  //   const { string, fret } = note.notations.technical;
  //   let findedEl;
  //   for (let index = acc.length - 1; index >= 0; index--) {
  //     const el = acc[index];
  //     if (checkTieType(el.tie, 'start') && el.string?._text === string?._text && el.fret?._text === fret?._text) {
  //       findedEl = el;
  //       break;
  //     }

  //   }
  //   // const findedEl = acc.reverse().find(el => checkTieType(el.tie, 'start') && el.string === string && el.fret === fret);
  //   if (findedEl) {
  //     findedEl.type = `${findedEl.type} ${note.type?._text}`;
  //     return true;
  //   }
  //   return;
  // }

  function buildGuitarSheet(list) {
    let barIndex = 0;
    const reducedList = list.reduce((acc, element, index) => {
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
      .map((element, index) => {
        const num = caculateNum(element.type, !!element.chords);
        const stringNote = caculateNoteString(element);
        return `${element.firstNoteOfBar ? `\n#${++barIndex}\n` : ''}${stringNote}${num}`;
      });
    console.log(reducedList);
    return reducedList.join(' ');
  }
  function caculateNum(type, hasChords) {
    let sumRatio;
    if (hasChords) {
      sumRatio = findMap(TIME_NODE_MAP, 'type', type.split(' ')[0])?.ratioWithBlackNode || 0;
    } else {
      sumRatio = type.split(' ').reduce((acc, el) => {
        // console.log(findMap(TIME_NODE_MAP, 'type', el));
        return acc + (findMap(TIME_NODE_MAP, 'type', el)?.ratioWithBlackNode || 0);
      }, 0);

    }
    const findedMap = TIME_NODE_MAP.find(el => sumRatio / el.ratioWithBlackNode >= 1 && sumRatio / el.ratioWithBlackNode < 2);
    const num = findedMap ? findedMap.num + (sumRatio / findedMap.ratioWithBlackNode - 1) : 0;
    return num < 0 ? num : `+${num}`;
  }

  function caculateNoteString(element) {
    return (element.chords ? [...element.chords, element] : [element])
      .map(el => el.fret?._text && parseInt(el.fret?._text) >= 0 && !el.mute ? `${el.string?._text}${el.fret?._text}` : 'NA')
      .join('=');
  }

  return <header className="header relative flex bg-[#f0f0f0] border-b border-b-[#cccccc] border-t border-t-[#cccccc]">

    <Dropdown>
      <Dropdown.Toggle as={React.forwardRef(({ onClick }, ref) => (
        <div
          className="w-[200px] px-2 py-2 flex text-[1.45rem] font-medium cursor-pointer"
          ref={ref}
          onClick={(e) => {
            e.preventDefault();
            onClick(e);
          }}
        >
          <div>i</div>
          <div className="text-black text-opacity-40">Tunss</div>
          <span className="material-symbols-rounded text-2xl">expand_more</span>
        </div>
      ))
      } id="dropdown-custom-components">
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item eventKey="1" onClick={importFile}>Nhập...</Dropdown.Item>
        <Dropdown.Item eventKey="2" >Thoát</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    <div className="drag-region flex-1 flex justify-center items-center">
      <div>
        <img className="w-[24px] h-[24px] cursor-pointer" src={apple} alt="" title="Applmao" />
      </div>
    </div>
    {/* <Navbar bg="light" className="px-4">
      <Navbar.Brand href="#" className="flex">
          <div>nmgh</div>
          <div className="text-black text-opacity-30 ml-1">Tools</div>
          </Navbar.Brand>
  </Navbar> */}
    <div className="w-[200px] px-2 flex justify-end items-center text-neutral-500">
      <span className="material-symbols-rounded text-2xl">contact_support</span>
    </div>
  </header>;
}