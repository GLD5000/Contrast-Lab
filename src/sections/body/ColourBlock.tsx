import { useColourBlocksContext } from '../../contexts/ColourBlocksProvider';
import H3 from '../../elements/H3';
import Span from '../../elements/Span';

function getContent(
  backgroundColour: string,
  showRatio: boolean,
  contrastRatio: number,
  contrastRating: string,
  autoColour: boolean,
) {
  // if (contrastRatio < 3) return null;
  if (autoColour)
    return <Span className="underline decoration-current underline-offset-2" content={backgroundColour.slice(1)} />;
  return <H3 content={showRatio ? contrastRatio : contrastRating} />;
}

export default function ColourBlock({
  backgroundColour = '#b0b0b0',
  textColour = '#000000',
  autoColour,
  contrastRating,
  contrastRatio,
}: {
  backgroundColour: string;
  textColour: string;
  autoColour: boolean;
  contrastRating: string;
  contrastRatio: number;
}) {
  const { showRatio, showPoor, dispatchColourBlocks } = useColourBlocksContext();
  if (!backgroundColour || !textColour) return null;
  function handleClick() {
    dispatchColourBlocks({ showRatio: !showRatio });
  }
  const style: { [elemName: string]: string } = {
    backgroundColor: backgroundColour,
    color: contrastRatio < 3 && showPoor === false ? 'transparent' : textColour,
    borderColor: autoColour || contrastRatio < 3 ? 'transparent' : textColour,
  };
  const returnContent = getContent(backgroundColour, showRatio, contrastRatio, contrastRating, autoColour);
  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-m m-1 grid aspect-square w-20 min-w-fit content-center rounded-full border-4 text-center text-current"
      style={style}
    >
      {returnContent}
    </button>
  );
}
