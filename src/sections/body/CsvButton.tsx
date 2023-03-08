import { useState, useEffect } from 'react';
import SvgButton from '../../elements/SvgButton';

export default function CsvButton({ data }: { data: string }) {
  const [copyButtonMessage, setCopyButtonMessage] = useState('Copy Data');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCopyButtonMessage('Copy Data');
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [copyButtonMessage]);

  return (
    <SvgButton
      type={copyButtonMessage === 'Copy Data' ? 'duplicate' : 'tick'}
      key={`${1}copyCode`}
      text={copyButtonMessage}
      clickFunction={() => {
        navigator.clipboard.writeText(data);
        setCopyButtonMessage('Copied!');
      }}
      showText
      reverse={false}
      buttonClasses="border-transparent sticky left-0"
      className=" sticky left-0 bottom-0 flex w-full items-center  justify-center gap-2 rounded-none border-2 border-transparent text-sm hover:bg-black hover:text-white hover:transition active:bg-slate-600 hover:dark:bg-white hover:dark:text-black"
      // marginLeft='auto'
      svgClasses="stroke-1 fill-none stroke-current"
      id="copy-table"
      name="Copy SVG Info"
      svgWrapperClasses="h-6 w-6"
    />
  );
}
