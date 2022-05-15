import React from 'react';

const TodoListContext = React.createContext();

const initialState = {};

export function reducer(state, action) {
  switch (action.type) {
    case 'setIsPlaying':
      return {
          ...state,
          isPlaying: { current: action.payload }
      };
    case 'setIsPause':
      return {
          ...state,
          isPause: { current: action.payload }
      };
    default:
      throw new Error();
  }
}

export default function StateProvider ({ children }) {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    return <TodoListContext.Provider value={{state, dispatch}}>
      {children}
    </TodoListContext.Provider>
}