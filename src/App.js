import React, { useState, useRef } from 'react';
import { DEFAULT_BLACKNOTEDURATION, EMPTY_NOTE, GUITAR_NOTE_MATRIX, KEYBOARD_MATRIX, NOTEID_LIST, SHEET_TYPE, TIME_NODE_MAP } from './const';
import { DATA_SHEET } from './data';
import useForceRender from './hook';
// import nutjsService from './services/nutjs';
import { findMap } from './utils';
import './styles/globals.scss';
import Header from './components/header';
import Footer from './components/footer';
import './App.scss';
import { Button, Form } from 'react-bootstrap';
import robotjsService from './services/robotjs';
// import { Key } from '@nut-tree/nut-js';
import cn from 'classnames';
import text_file from './assets/images/text_file.png';

function App() {
    const forceRender = useForceRender();
    const [sheet, setSheet] = useState(DATA_SHEET);
    const [blackNoteDuration, setBlackNoteDuration] = useState(DEFAULT_BLACKNOTEDURATION);
    const [sheetType, setSheetType] = useState(SHEET_TYPE.GUITAR);
    const [totalDuration, setTotalDuration] = useState(0);
    const [currentDuration, setCurrentDuration] = useState(0);
    const [currentFileIndex, setCurrentFileIndex] = useState();
    const isPlaying = useRef();
    const isPause = useRef();
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
        setCurrentDuration(0);
        setTotalDuration(0);
    }

    function handleStart() {
        isPlaying.current = true;
        forceRender();
        // setTimeout(async () => {
        //     robotjsService.setKeyboardDelay(0);
        //     await robotjsService.testTap('f');
        //     await robotjsService.testTap('z');
        //     await robotjsService.testSetDelayMs(1000);
        //     await robotjsService.testTap('f');
        //     await robotjsService.testTap('f');
        //     await robotjsService.testTap('f');
        //     await robotjsService.testTap('f');
        //     await robotjsService.testTap('f');
        //     await robotjsService.testTap('f');
        //     await robotjsService.testTap('f');
        //     await robotjsService.testTap('f');
        //     await robotjsService.testTap('f');
        //     await robotjsService.testTap('f');
        //     await robotjsService.testTap('f');
        //     await robotjsService.testTap('f');
        //     await nutjsService.configAutoDelayMs(0);
        //     await nutjsService.pressKey(45);
        //     await nutjsService.releaseKey(45);
        //     await nutjsService.pressKey(46);
        //     await nutjsService.releaseKey(46);
        //     await nutjsService.pressKey(47);
        //     await nutjsService.releaseKey(47);
        //     await nutjsService.configAutoDelayMs(5000);

        // }, 5100);
        // return;
        const nodeConfig = parseSheet();
        setTotalDuration(nodeConfig.reduce((acc, el) => acc = el.duration ? acc + el.duration : acc, 0));
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
                    if (Number.isInteger(frag1) && Number.isInteger(frag2)) {
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
        setTimeout(async () => {
            robotjsService.setKeyboardDelayAsync(0);
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
                setCurrentDuration(currentDuration => currentDuration + duration);
                //       robotjsService.setKeyboardDelay(duration);
                await listenPause();
                await listenStop();
                // await sleep(duration);
            }

            isPlaying.current = false;
            isStop.current = true;
            forceRender();
        }, 5000)
    }

    function isValidXY(x, y) {
        return [x, y].every(el => Number.isInteger(el));
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

    function handleChange(e) {
        setSheet(e.target.value);
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
        forceRender();
        rejectStop.current && rejectStop.current();
    }


    console.log(currentDuration);
    console.log(totalDuration);

    return <div className="h-full flex flex-col">
        <Header />

        <div className="flex-1 flex">
            <div className="flex-1 flex flex-col">
                <div className="border-b flex justify-between">
                    <div className="w-[200px] p-2 flex justify-between">
                    <div>
                        <Button variant="" className="btn-icon text-xl">
                            <span className="material-symbols-rounded">arrow_back_ios_new</span>
                        </Button>
                        <Button variant="" className="btn-icon text-xl">
                            <span className="material-symbols-rounded">arrow_forward_ios</span>
                        </Button>

                    </div>
                    <div>
                    </div>

                    </div>
                    <div className="p-2 flex-1 flex justify-between items-center">
                        <div>
                            {/* <span>than van he.txt</span> */}
                        </div>
                        <div>
                            <Button variant="primary">Lưu</Button>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex">
                    <div className="border-r w-[200px]">
                        <div className="flex justify-between items-center px-4 pr-2 py-2">
                            <label className="form-label">Danh sách</label>
                            <Button variant="" className="btn-icon text-xl">
                                <span className="material-symbols-rounded">format_list_bulleted</span>
                            </Button>
                        </div>
                        <div className="px-2">
                            {[1, 1, 1, 1].map((item, index) =>
                                <div className={cn('cursor-pointer px-2 py-1', { 'bg-blue-100 border border-blue-200 font-bold': currentFileIndex === index })} 
                                onClick={() => setCurrentFileIndex(index)}
                                >
                                    <div className="text-black">
                                    <img src={text_file} alt="" />
                                        than van het.txt
                                        </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 p-2">
                        <h3>than van he.txt</h3>
                        <Form.Control className="border-0 h-full" as="textarea" spellCheck="false" value={sheet} onChange={handleChange} />
                    </div>
                </div>

            </div>

            <div className="w-[200px] px-3 bg-[#f0f0f0] border-l">
                <div className="py-2">
                    <Form.Label>Độ dài</Form.Label>
                    <Form.Control type="number" value={blackNoteDuration} onChange={(e) => setBlackNoteDuration(e.target.value)} />
                </div>
                <div className="py-2">
                    <Form.Label>Loại phổ</Form.Label>
                    <Form.Check type="radio" name="sheedType" label="Ký tự nốt trên đàn" value={SHEET_TYPE.NOTE} checked={sheetType === SHEET_TYPE.NOTE} onChange={(e) => setSheetType(e.target.value)} />
                    {/* <Form.Check type="radio" name="sheedType" label="Nốt nhạc" value={SHEET_TYPE.POSITION} checked={sheetType === SHEET_TYPE.POSITION} onChange={(e) => setSheetType(e.target.value)} /> */}
                    <Form.Check type="radio" name="sheedType" label="Guitar Tab" value={SHEET_TYPE.GUITAR} checked={sheetType === SHEET_TYPE.GUITAR} onChange={(e) => setSheetType(e.target.value)} />

                </div>
                <hr className="my-2" />
                <div className="py-2">
                    <Form.Check type="checkbox" name="sheedType" label="Âm dài (Thổi sáo)" />
                </div>

            </div>
        </div>
        <Footer
            isPlaying={isPlaying}
            isPause={isPause}
            isStop={isStop}
            handlePlay={handlePlay}
            handlePause={handlePause}
            handleStop={handleStop}
            progress={(totalDuration && (currentDuration * 100 / totalDuration)) || 0}
        />
    </div>
}

export default App;
