import { ReactTranslatorContext } from '@oneforx/react-translator';
import { useContext, useMemo } from 'react';
import { Outlet } from 'react-router-dom'

const MainController = ( ) => {
  const { translated } = useContext(ReactTranslatorContext)
  const nvBarCn = useMemo(() => "md:px-32 flex justify-between", [])
  const nvItemCn = useMemo(() => "", []);

  return (
    <div className="h-full flex flex-col">

      {/**#region Navbar */}
      <div className={nvBarCn}>
        <div className="px-2 py-4">React Translator</div>
        <div className="flex py-2">
          <div className="py-2 md:px-4">{translated["my_editor_navbar_item_key"] || "My editor"}</div>
          <button className="underline px-4 py-2 rounded mr-2">Connexion</button>
          <button className="bg-teal-500 px-4 py-2 text-white rounded">Inscription</button>
        </div>
      </div>
      {/**#endregion */}

      {/**#region Screens */}
      <Outlet />
      {/**#endregion */}
    </div>
  );
}

export default MainController
