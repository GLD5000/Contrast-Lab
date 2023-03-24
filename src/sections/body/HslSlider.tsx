import { MouseEvent } from 'react';
import { useColourInputContext } from '../../contexts/ColourInputProvider';

export default function HslSlider({ handleClickAdd }: { handleClickAdd: () => void }) {
  const { recentColour, hslSlider, sliderType, dispatchColourInput } = useColourInputContext();

  function handleTypeClick() {
    const typeLookup: { [key: string]: string } = {
      Hue: 'Sat',
      Sat: 'Lum',
      Lum: 'Hue',
    };
    const newType = typeLookup[sliderType];
    dispatchColourInput({ type: 'SET_TYPE', payload: { textInput: newType } });
  }
  function handleSliderInput(e: MouseEvent<HTMLInputElement>) {
    console.log('e.currentTarget.value:', e.currentTarget.value);
    dispatchColourInput({ type: 'UPDATE_HSL', payload: { hslSlider: Number(e.currentTarget.value), sliderType } });
  }

  function handleClickRandom() {
    dispatchColourInput({ type: 'RANDOMISE', payload: {} });
  }

  return (
    <div className="grid ">
      <div className="flex h-12 w-full flex-row flex-wrap content-center gap-2 px-2">
        <label htmlFor="hsl-slider">
          <button
            className="w-16 bg-deco py-2 px-4 text-xs hover:bg-txt-low hover:text-bg-var hover:transition dark:bg-deco-dk hover:dark:bg-txt-main-dk hover:dark:text-bg-var-dk"
            type="button"
            onClick={handleTypeClick}
          >
            {sliderType}
          </button>
        </label>
        {recentColour !== undefined ? (
          <input
            id="hsl-slider"
            className="my-auto h-1 shrink-0 grow cursor-pointer appearance-none rounded bg-neutral-500 text-black dark:text-white"
            type="range"
            min={0}
            max={360}
            value={hslSlider}
            onInput={handleSliderInput}
          />
        ) : (
          <input
            id="hsl-slider"
            disabled
            className="my-auto h-1 shrink-0 grow cursor-not-allowed appearance-none rounded bg-neutral-500 text-neutral-500"
            type="range"
            min={0}
            max={360}
            value={hslSlider}
            onInput={handleSliderInput}
          />
        )}
      </div>
      <div className="flex h-12 flex-row gap-1 p-1">
        <button
          type="button"
          id="randomise-colour"
          className="active:deco mx-auto my-0  flex  w-full content-center gap-4 rounded bg-deco py-2 px-4 text-current hover:bg-txt-low  hover:text-bg-var hover:transition dark:bg-deco-dk hover:dark:bg-txt-main-dk hover:dark:text-bg-var-dk"
          onClick={handleClickRandom}
        >
          <p className="m-auto text-sm">Randomise</p>
        </button>

        <button
          type="button"
          id="add-colour"
          className="active:deco mx-auto my-0 flex  w-full content-center gap-4 rounded bg-deco py-2 px-4  text-current hover:bg-txt-low  hover:text-bg-var hover:transition dark:bg-deco-dk hover:dark:bg-txt-main-dk hover:dark:text-bg-var-dk"
          onClick={handleClickAdd}
        >
          <p className="m-auto text-sm">Submit</p>
        </button>
      </div>
    </div>
  );
}
