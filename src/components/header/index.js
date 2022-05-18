import apple from '../../assets/images/apple.png';
import { DATA_FILE_XML } from '../../data';

export default function Header() {
  function handleClick () {
    const a = DATA_FILE_XML.part.measure.reduce((barAcc, bar) => {
      const reduceNote = bar.note.reduce((acc, note) => {
        if (note.notations?.technical) {
          if (checkTieType(note.tie, 'stop')) {
            findLatestTieBeginAndMerge(acc, note) || findLatestTieBeginAndMerge(barAcc, note);
            return acc;
          }
          return [
            ...acc,
            {
              type: note.type,
              tie: note.tie,
              ...note.notations.technical,
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
    console.log(a);
    
    function checkTieType(tie, type) {
      return Array.isArray(tie) ? true : tie?.['@type'] === type;
    }
    function findLatestTieBeginAndMerge(acc, note) {
      const { string, fret } = note.notations.technical;
      const findedEl = acc.find(el => checkTieType(el.tie, 'start') && el.string === string && el.fret === fret);
      if (findedEl) {
        findedEl.type = `${findedEl.type} ${note.type}`;
        return true;
      }
      return;
    }
  }
  return <header className="px-2 relative flex bg-[#f0f0f0] border-b border-b-[#cccccc] border-t border-t-[#cccccc]">
    {/* <div className="absolute inset-0 flex justify-center items-center">
      <img className="w-[24px] h-[24px]" src={apple} alt="" />
    </div> */}
    <div className="py-[6px] flex text-[1.45rem] font-medium">

      <div>"ai"</div>
      <div className="text-black text-opacity-40 ml-1">Tools</div>
    </div>
    <div className="flex-1"></div>
    {/* <Navbar bg="light" className="px-4">
      <Navbar.Brand href="#" className="flex">
          <div>nmgh</div>
          <div className="text-black text-opacity-30 ml-1">Tools</div>
          </Navbar.Brand>
  </Navbar> */}
    <div>
      <button onClick={handleClick}>click</button>
    </div>
  </header>;
}