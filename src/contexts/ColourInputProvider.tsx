import { createContext, ReactNode, useContext, useReducer, Dispatch, useEffect } from 'react';
import { colourSpace } from '../utilities/colour/colourSpace';
import { contrast } from '../utilities/colour/contrastRatio';
import { luminance } from '../utilities/colour/luminance';
import { randomColour } from '../utilities/colour/randomColour';
import { getSessionStorageMap, clearSessionStorageMap, setSessionStorageMap } from './sessionStorageMap';

const initialiserA: {
  textInput: string;
  mode: string;
  recentColour: { [key: string]: string | number } | undefined;
  colourMap: undefined | Map<string, { [key: string]: string | number }>;
  dispatchColourInput: Dispatch<{
    type: string;
    payload: Partial<{
      textInput: string;
      mode: string;
      recentColour: { [key: string]: string | number } | undefined;
      colourMap: undefined | Map<string, { [key: string]: string | number }>;
    }>;
  }>;
} = {
  textInput: '',
  mode: 'Hex',
  recentColour: undefined,
  colourMap: undefined,
  dispatchColourInput: () => undefined,
};

const initialiserB: {
  textInput: string;
  mode: string;
  recentColour: { [key: string]: string | number } | undefined;
  colourMap: undefined | Map<string, { [key: string]: string | number }>;
} = {
  textInput: '',
  mode: 'Hex',
  recentColour: undefined,
  colourMap: undefined,
};

function useData() {
  const [{ textInput, mode, recentColour, colourMap }, dispatchColourInput] = useReducer(tagReducer, initialiserB);
  useEffect(() => {
    dispatchColourInput({ type: 'INIT', payload: {} });
  }, []);
  return {
    textInput,
    mode,
    colourMap,
    recentColour,
    dispatchColourInput,
  };
  function tagReducer(
    state: {
      textInput: string;
      mode: string;
      recentColour: { [key: string]: string | number } | undefined;
      colourMap: undefined | Map<string, { [key: string]: string | number }>;
    },
    action: {
      type: string;
      payload: Partial<{
        textInput: string;
        mode: string;
        recentColour: { [key: string]: string | number } | undefined;
        colourMap: undefined | Map<string, { [key: string]: string | number }>;
        tag: string;
      }>;
    },
  ): {
    textInput: string;
    mode: string;
    recentColour: { [key: string]: string | number } | undefined;
    colourMap: undefined | Map<string, { [key: string]: string | number }>;
  } {
    switch (action.type) {
      case 'INIT': {
        const savedMap = getSessionStorageMap();
        const recentColourValue = makeColourObjectHsl(randomColour.makeRandomHslString());
        const returnValue = {
          textInput: recentColourValue.Hex,
          mode: 'Hex',
          recentColour: recentColourValue,
          colourMap: savedMap,
        };
        return returnValue;
      }
      case 'UPDATE_TEXT': {
        const { processedText, processedArray } = processText(action.payload.textInput || '');
        console.log(processedText, processedArray);
        const returnedColours = state.colourMap ? [...state.colourMap.keys()] : [];
        const joinedArrays = returnedColours ? [...returnedColours, ...processedArray] : processedArray;
        const newMap = createMap(joinedArrays) || undefined;
        const recentColourValue = getRecentColour(processedText);
        const textOutput =
          valueIsHex(processedText) && recentColourValue !== undefined
            ? `${recentColourValue[state.mode]}`
            : processedText;
        const returnValue = {
          ...state,
          textInput: textOutput || '',
          recentColour: recentColourValue,
          colourMap: newMap,
        };
        return returnValue;
      }
      case 'UPDATE_HSL': {
        const newHsl = action.payload.textInput;
        const recentColourValue: { [key: string]: string | number } | undefined = newHsl
          ? makeColourObjectHsl(newHsl)
          : undefined;
        const modeOut = state.mode ? state.mode : 'Hex';
        const textOutput = recentColourValue ? `${recentColourValue[modeOut]}` : '';
        const returnValue = {
          ...state,
          textInput: textOutput,
          recentColour: recentColourValue,
        };
        return returnValue;
      }
      case 'CLEAR_TAGS': {
        const newMap = new Map(state.colourMap);
        newMap.clear();
        clearSessionStorageMap();
        const returnValue = {
          ...state,
          colourMap: newMap,
          textInput: '',
          mode: 'Hex',
          recentColour: undefined,
        };
        return returnValue;
      }
      case 'CHANGE_MODE': {
        const newMode = action.payload.mode || 'Hex';
        const returnValue = { ...state, mode: newMode };
        if (returnValue.recentColour !== undefined) returnValue.textInput = `${returnValue.recentColour[newMode]}`;
        return returnValue;
      }
      case 'CLOSE_TAG':
      default: {
        const { tag } = action.payload;
        const newMap = new Map(state.colourMap);
        if (typeof tag === 'string' && newMap.has(tag)) newMap.delete(tag);
        setSessionStorageMap(newMap);
        const returnValue = { ...state, colourMap: newMap, recentColour: undefined };
        return returnValue;
      }
    }
  }
}

const ColourInput = createContext(initialiserA);
export const useColourInputContext = () => useContext(ColourInput);

export default function ColourInputProvider({ children }: { children: ReactNode }) {
  const data = useData();
  return <ColourInput.Provider value={data}>{children}</ColourInput.Provider>;
}

function valueIsHex(input: string) {
  const returnBoolean = input.length === 7 && input.search(/#[0-9a-fA-F]{6}/) === 0;
  return returnBoolean;
}

function processHexString(value: string) {
  if (value[0] !== '#' || value.length < 2 || value.slice(1).search(/#|[^0-9a-fA-F]/) > -1) return value;
  let modifiedHex = value.length > 7 ? value.slice(0, 7) : value;
  if (value.length < 7) {
    const characters = value.slice(1);
    modifiedHex = modifiedHex.padEnd(7, characters);
  }
  return modifiedHex;
}

function testRgbString(testString: string) {
  const prefix = testString.slice(0, 4).toLowerCase();
  const startsWithRgbBracket = prefix === 'rgb(';
  const endsWithBracket = testString.at(-1) === ')';
  const containsTwoCommas = testString.replaceAll(',', '').length + 2 === testString.length;
  const shouldReturn = !startsWithRgbBracket || !endsWithBracket || !containsTwoCommas;
  if (shouldReturn) return { isRgb: false, result: undefined };
  const stringArray = testString.slice(4, -1).replaceAll(', ', ',').split(',');
  const withinRange = (testValue: number) => testValue >= 0 && testValue <= 255;
  const numberArray = stringArray.map((x) => parseInt(x, 10));
  const booleanResult = numberArray.every(withinRange);
  const arrayResult = booleanResult ? numberArray : undefined;
  return { isRgb: booleanResult, result: arrayResult };
}

function processRgbString(value: string) {
  const { isRgb, result } = testRgbString(value);
  if (!isRgb || result === undefined) return value;

  const hex = colourSpace.convertRgbToHex(result);
  return hex;
}

function processHslString(value: string) {
  const hslRegex = /(hsl)|(HSL)\(((360)|(3[0-5][0-9])|([1-2]?[0-9]{1,2}))(,[ ]?(100|([0-9]{1,2}))%?){2}\)/;
  if (value.search(hslRegex) === -1) return value;
  const cleanedUpValue = value.toLowerCase().replaceAll(/[ ()hsl%]/g, '');
  const hslArray = cleanedUpValue.split(',').map((x) => parseInt(x, 10));
  const hex = colourSpace.convertHslArrayToHex(hslArray);
  return hex;
}

function processColourStringLong(stringIn: string) {
  if (stringIn.length < 7) return stringIn;
  return processColourString(stringIn);
}
function getRecentColour(text: string): undefined | { [key: string]: string | number } {
  const testedProcessedText = valueIsHex(text) ? text : processColourStringLong(text);
  const recentColour = valueIsHex(testedProcessedText) ? makeColourObject(testedProcessedText) : undefined;
  return recentColour;
}

function processColourString(stringIn: string) {
  if (stringIn.includes('#')) return processHexString(stringIn);
  if (stringIn.toLowerCase().includes('hsl')) return processHslString(stringIn);
  if (stringIn.toLowerCase().includes('rgb')) return processRgbString(stringIn);
  return stringIn;
}

function hexReducer(acc: { processedText: string; processedArray: string[] }, curr: string) {
  const processedHex = processColourString(curr);
  if (processedHex.length === 7 && processedHex[0] === '#') {
    acc.processedArray.push(processedHex);
    return acc;
  }
  acc.processedText += acc.processedText.length > 0 ? ` ${curr}` : curr;
  return acc;
}

function processText(text: string) {
  const isEmpty = text === '';
  const hasNoSpaces = text.search(/\s/) === -1;
  if (isEmpty || hasNoSpaces) {
    return { processedText: text, processedArray: [] };
  }
  const noSpaceAtEnd = text[text.length - 1].search(/\s/) === -1;
  const splitText = text.replaceAll(', ', ',').split(/\s/);

  if (noSpaceAtEnd) {
    const slicedArray = splitText.slice(0, -1);
    const lastElement = splitText.at(-1)?.replaceAll(',', ', ');
    const { processedText, processedArray } = slicedArray.reduce(hexReducer, {
      processedText: '',
      processedArray: [],
    });
    const suffixedText = processedText.length > 0 ? `${processedText} ${lastElement}` : `${lastElement}`;
    return { processedText: suffixedText, processedArray };
  }
  const { processedText, processedArray } = splitText.reduce(hexReducer, {
    processedText: '',
    processedArray: [],
  });
  return { processedText, processedArray };
}

function makeColourObject(hexValue: string) {
  const luminanceFloat = luminance.convertHexToLuminance(hexValue);
  const Hex = hexValue;
  const HSL = colourSpace.convertHexToHslString(hexValue);
  const RGB = colourSpace.convertHextoRgbString(hexValue);
  const Luminance = luminance.convertHexToLuminancePercent(hexValue);
  const Black = `${contrast.getContrastRatio2Dp([0, luminanceFloat])}`;
  const White = `${contrast.getContrastRatio2Dp([1, luminanceFloat])}`;
  return {
    luminanceFloat,
    Hex,
    HSL,
    RGB,
    Luminance,
    Black,
    White,
  };
}
function makeColourObjectHsl(hslValue: string) {
  const Hex = colourSpace.convertHslStringToHex(hslValue);
  const HSL = hslValue;
  const RGB = colourSpace.convertHextoRgbString(Hex);
  const Luminance = luminance.convertHexToLuminancePercent(Hex);
  const luminanceFloat = luminance.convertHexToLuminance(Hex);
  const Black = `${contrast.getContrastRatio2Dp([0, luminanceFloat])}`;
  const White = `${contrast.getContrastRatio2Dp([1, luminanceFloat])}`;
  return {
    luminanceFloat,
    Hex,
    HSL,
    RGB,
    Luminance,
    Black,
    White,
  };
}

function createMap(hexArray: string[] | undefined) {
  if (!hexArray) return undefined;
  const filteredArray = hexArray.filter(valueIsHex);
  if (filteredArray.length === 0) return undefined;
  const buildArray: Iterable<readonly [string, { [key: string]: string | number }]> | null = filteredArray.map(
    (hex) => {
      const colourObject = makeColourObject(hex);
      return [hex, colourObject];
    },
  );
  const mapValue: Map<string, { [key: string]: string | number }> | undefined = buildArray
    ? new Map(buildArray)
    : undefined;
  if (mapValue) setSessionStorageMap(mapValue);
  return mapValue;
}
