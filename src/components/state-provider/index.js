import React from 'react';
import { DEFAULT_BLACKNOTEDURATION, SHEET_TYPE } from '../../const';
import { DATA_SHEET } from '../../data';

export const AppContext = React.createContext();

const initialState = {
  sheet: DATA_SHEET,
  blackNoteDuration: DEFAULT_BLACKNOTEDURATION,
  sheetType: SHEET_TYPE.GUITAR,
  totalDuration: 0,
  currentDuration: 0,
  isPlaying: { current: null },
  isPause: { current: null },
  currentContenFile: null,
};
export function reducer(state, action) {

  function handleReturn(name, isRef = false) {
    const payload = typeof action.payload === 'function' ? action.payload(state[name]): action.payload;
    if (isRef) {
      return {
        ...state,
        [name]: { current: payload }
      };
    }
    return {
      ...state,
      [name]: payload,
    };
  }
  switch (action.type) {
    case 'setSheet':
      return handleReturn('sheet');
      case 'setBlackNoteDuration':
      return handleReturn('blackNoteDuration');  
    case 'setSheetType':
      return handleReturn('sheetType');  
    case 'setTotalDuration':
      return handleReturn('totalDuration');  
    case 'setCurrentDuration':
      return handleReturn('currentDuration');  
    case 'setIsPlaying':
      return handleReturn('isPlaying', true);  
    case 'setIsPause':
      return handleReturn('isPause', true);  
    case 'setCurrentFile':
      return handleReturn('currentFile');  
    default:
      throw new Error();
  }
}

export default function StateProvider ({ children }) {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    function dispatchAction (type, payload) {
      dispatch({type, payload})
    }
    return <AppContext.Provider value={{state, dispatch: dispatchAction}}>
      {children}
    </AppContext.Provider>
}