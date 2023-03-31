import { createContext, ReactNode, useContext, useReducer, Dispatch, useEffect } from 'react';
import { useColourInputContext } from './ColourInputProvider';

export interface BlocksState {
  colourMode: string;
  showRatio: boolean;
  showPoor: boolean;

  limit: string;
  visibleSet: Set<string>;
}

export type BlocksPayload = Partial<BlocksState>;

export interface BlocksContext extends BlocksState {
  dispatchColourBlocks: Dispatch<BlocksPayload>;
}

const initialiserA: BlocksContext = {
  colourMode: 'Name',
  showRatio: false,
  showPoor: true,
  limit: 'All',
  visibleSet: new Set(''),
  dispatchColourBlocks: () => undefined,
};

const initialiserB: BlocksState = {
  colourMode: 'Name',
  showRatio: false,
  showPoor: true,
  limit: 'All',
  visibleSet: new Set(''),
};

function useData() {
  const { colourMap } = useColourInputContext();
  const [{ colourMode, showRatio, showPoor, limit, visibleSet }, dispatchColourBlocks] = useReducer(
    (state: BlocksState, action: BlocksPayload) => ({ ...state, ...action }),
    initialiserB,
  );

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const keysArray = colourMap !== undefined ? [...colourMap.keys()] : undefined;
      if (keysArray) dispatchColourBlocks({ visibleSet: new Set(keysArray) });
    }
    return () => {
      mounted = false;
    };
  }, [colourMap]);

  return {
    colourMode,
    showRatio,
    showPoor,
    limit,
    visibleSet,
    dispatchColourBlocks,
  };
}

const ColourBlocks = createContext(initialiserA);
export const useColourBlocksContext = () => useContext(ColourBlocks);
export default function ColourBlocksProvider({ children }: { children: ReactNode }) {
  const data = useData();
  return <ColourBlocks.Provider value={data}>{children}</ColourBlocks.Provider>;
}
