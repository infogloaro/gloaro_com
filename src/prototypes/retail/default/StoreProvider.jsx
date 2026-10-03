import { useMemo, useReducer } from 'react'
import { StoreContext, initialState, reducer } from './store'

export default function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
