import SvgButton from '../elements/SvgButton';
import GldSvg from '../icons/GldSvg';

export default function Header({
  title,
  toggleColourTheme,
  colourTheme,
}: {
  title: string;
  toggleColourTheme: () => void;
  colourTheme: string;
}) {
  return (
    <header className="sticky top-0 left-0 right-0 z-[999] grid h-fit w-screen flex-shrink-0 flex-grow-0 grid-cols-frAutoFr content-center bg-neutral-100 dark:bg-neutral-800">
      <nav className=" col-start-2 flex w-body min-w-body max-w-body flex-wrap items-center justify-between align-middle  ">
        <div className="flex h-16 flex-wrap items-center gap-4 p-2">
          <GldSvg />
          <h2>{title}</h2>
        </div>
        <div className="relative flex h-16 flex-wrap items-center justify-center gap-4 py-2">
          {/* <Button
            backgroundColor=""
            text={colourTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            clickFunction={toggleColourTheme}
            id="colour-theme-button"
            name="Dark Mode Button"
            className="rounded text-xs"
            activeClasses="dark:hover:bg-neutral-100 dark:hover:text-neutral-900 hover:text-neutral-50 hover:bg-neutral-800"
            conditionalClasses=""
          /> */}
          <SvgButton
            svgWrapperClasses="pointer-events-none h-6 w-6"
            text={colourTheme === 'dark' ? 'Light' : 'Dark'}
            clickFunction={toggleColourTheme}
            type={colourTheme === 'dark' ? 'sun' : 'moon'}
            showText
            reverse={false}
            id="colour-theme-button"
            name="Dark Mode Button"
            className="rounded text-xs"
            buttonClasses="w-fit h-fit flex flex-col overflow-hidden border border-transparent hover:border-current hover:transition py-1 px-2"
            svgClasses="stroke-current fill-current stroke-2"
          />
        </div>
      </nav>
    </header>
  );
}
