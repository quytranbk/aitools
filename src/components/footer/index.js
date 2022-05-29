import { useContext, useEffect, useRef, useState } from 'react';
import { Button, ProgressBar, Spinner } from 'react-bootstrap';
import { EMPTY_NOTE, GUITAR_NOTE_MATRIX, KEYBOARD_MATRIX, NOTEID_LIST, SHEET_TYPE, TIME_NODE_MAP } from '../../const';
import useForceRender from '../../hook';
import robotjsService from '../../ipc/robotjs';
import { findMap } from '../../utils';
import { AppContext } from '../state-provider';

export default function Footer () {
  
  const {
    state: {
        sheet,
        blackNoteDuration,
        sheetType,
        totalDuration,
        currentDuration,
        isPlaying,
        isPause,
        isHoldSpace,
}, dispatch 
} = useContext(AppContext);
const forceRender = useForceRender();

const [timeoutCount, setTimeoutCount] = useState();
const resolvePause = useRef();
const isStop = useRef();
const rejectStop = useRef();


function handlePlay() {
    if (!isPlaying.current) {
        resetState();
        return handleStart();
    }
    handlePause();
}

function resetState() {
    isPause.current = false;
    dispatch('setCurrentDuration', 0);
    dispatch('setTotalDuration', 0);
}

function handleStart() {
    isPlaying.current = true;
    forceRender();
    // setTimeout(async () => {
    //     robotjsService.setKeyboardDelay(0);
    //     await robotjsService.testTap('f');
    //     await robotjsService.testTap('z');

    // }, 5100);
    // return;
    const nodeConfig = parseSheet();
    dispatch('setTotalDuration', nodeConfig.reduce((acc, el) => acc = Number.isInteger(el.duration) ? acc + el.duration : acc, 0));
    // return console.log('nodeConfig', nodeConfig);
    nodeConfig && playSheet(nodeConfig);
}

function parseSheet() {
    if (sheet) {
        const nodes = splitSheetToNode(sheet);
        // return;
        const nodeConfig =
            nodes
                .filter(Boolean)
                .map(node => {
                    if (node.length >= 2) {
                        const notes = splitNode(node);
                        const notePos = notes.map(note => getPosition(note));
                        const frag3 = notes[notes.length - 1].slice(2);
                        const duration = calculateDuration(frag3);
                        return { notePos, duration };
                    }
                    return { duration: blackNoteDuration };
                });
        return nodeConfig;
    }
    return;
}

function splitSheetToNode(sheet) {
    const filterdSheet = sheet.split(/\n/).filter(line => line.trim().charAt(0) !== '#').join(' ');
    console.log('filterdSheet', filterdSheet);
    return filterdSheet.split(/\s+/);
}

function splitNode(node) {
    const notes = node.split('=');
    if (sheetType === SHEET_TYPE.GUITAR) {
        return notes.map(note => {
            if (note.length >= 2) {
                const frag1 = parseInt(note.charAt(0));
                const frag2 = parseInt(note.charAt(1));
                if (Number.isInteger(frag1) && Number.isInteger(frag2) && frag2 >= 0) {
                    const guitarNote = GUITAR_NOTE_MATRIX[frag1 - 1] && GUITAR_NOTE_MATRIX[frag1 - 1][frag2];
                    if (guitarNote) {
                        return guitarNote + note.slice(2);
                    }
                    return 'NA';
                }
                return 'NA';
            }
            return 'NA';
        })
    }
    return notes;
}

function getPosition(note) {
    if (note.length >= 2) {
        switch (sheetType) {
            case SHEET_TYPE.GUITAR:
            case SHEET_TYPE.NOTE: {
                const frag1 = note.charAt(0);
                const frag2 = note.charAt(1);
                const x = calculateX(frag1);
                const y = calculateY(frag2);
                return { x, y };
            }
            case SHEET_TYPE.POSITION: {
                const frag1 = note.charAt(0);
                const frag2 = note.charAt(1);
                const x = parseInt(frag1);
                const y = parseInt(frag2);
                return { x, y };
            }
            default: { }
        }
    }
    return {};
}

function calculateX(char) {
    const x = NOTEID_LIST.findIndex(el => el === char.toLowerCase());
    return x > -1 ? x : null;
}

function calculateY(char) {
    return parseInt(char) - 1;
}

function calculateDuration(str) {
    if (!str) {
        return blackNoteDuration;
    }
    try {
        const num = parseFloat(str);
        if (Number.isInteger(num)) {
            const findItem = findMap(TIME_NODE_MAP, 'num', num);
            const ratio = findItem ? findItem.ratioWithBlackNode : 1;
            return blackNoteDuration * ratio;
        } else {
            const findItem = findMap(TIME_NODE_MAP, 'num', parseInt(num));
            const ratio = findItem ? findItem.ratioWithBlackNode : 1;
            return blackNoteDuration * ratio * 1.5;
        }
    } catch (e) {
        return blackNoteDuration;
    }
}

function playSheet(nodeConfig) {
    const x = setTimeout(async () => {
        robotjsService.setKeyboardDelayAsync(0);
        isHoldSpace && await robotjsService.keyToggleAsync('space', 'down');
        // await nutjsService.configAutoDelayMs(0);
        for (const { notePos, duration } of nodeConfig) {
            // notePos.forEach(async ({x, y}, index) => {
            //     const key = isValidXY(x, y) ? KEYBOARD_MATRIX[y][x] : EMPTY_NOTE;
            //     if (index !== notePos.length - 1) {
            //       // robotjsService.setKeyboardDelay(0);
            //       await nutjsService.configAutoDelayMs(0);
            //     } else {
            //       // robotjsService.setKeyboardDelay(duration);
            //       await nutjsService.configAutoDelayMs(duration);
            //     }
            //     // const a = robotjsService.keyTap(key);
            //     await nutjsService.type(key);
            //     console.log(new Date());
            // });
            for (const index in notePos) {
                const { x, y } = notePos[index];
                const key = isValidXY(x, y) ? KEYBOARD_MATRIX[y][x] : EMPTY_NOTE;
                if (+index !== notePos.length - 1) {
                    robotjsService.setKeyboardDelayAsync(0);
                    // await nutjsService.configAutoDelayMs(0);
                } else {
                    robotjsService.setKeyboardDelayAsync(duration);
                    // await nutjsService.configAutoDelayMs(duration);
                }
                // await nutjsService.type(key);
                await robotjsService.keyTapAsync(key);
                console.log(new Date());
            }
            dispatch('setCurrentDuration', currentDuration => currentDuration + (Number.isInteger(duration) ? duration: 0));
            //       robotjsService.setKeyboardDelay(duration);
            await listenPause();
            try {
                await listenStop();
            } catch(e) {
                isHoldSpace && await robotjsService.keyToggleAsync('space', 'up');
            }
            // await sleep(duration);
        }

        isPlaying.current = false;
        isStop.current = true;
        forceRender();
        isHoldSpace && await robotjsService.keyToggleAsync('space', 'up');
    }, 5000);
    setTimeoutCount(x);
}

function isValidXY(x, y) {
    return Number.isInteger(x) && x <= 6 && Number.isInteger(y) && y <= 2;
}

async function listenPause() {
    return new Promise(res => {
        resolvePause.current = res;
        if (!isPause.current) {
            res();
        }
    });
}

async function listenStop() {
    return new Promise((res, rej) => {
        rejectStop.current = rej;
        if (isPlaying.current) {
            res();
        }
    });
}

function handlePause(e) {
    isPause.current = !isPause.current;
    forceRender();
    if (!isPause.current) {
        resolvePause.current && resolvePause.current();
    }
}

function handleStop(e) {
    isPlaying.current = false;
    resetState();
    forceRender();
    rejectStop.current && rejectStop.current();
}

useEffect(() => () => {
    resolvePause.current?.();
    rejectStop.current?.();
    clearTimeout(timeoutCount);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


console.log(currentDuration);
console.log(totalDuration);

    return <footer className="flex bg-[#f0f0f0] border-t">
      <div className="flex-1 flex items-center py-2 px-4">
        <ProgressBar animated now={(totalDuration && (currentDuration * 100 / totalDuration)) || 0} className="w-full h-1" />
      </div>
      <div className="w-[200px] py-2 px-4 flex justify-end items-center">
                    {
                        (isPlaying.current) && <>
                    <Spinner animation="grow" size="sm" className="flex-none text-slate-400 mr-2" />
                        <Button variant="default" className="mr-2" onClick={handleStop}>Hủy</Button>
                        </>
                    }
        <Button variant="primary" onClick={handlePlay}>{!isPlaying.current || isPause.current ? 'Play' : 'Pause'}</Button>
        
      </div>
    </footer>;
}