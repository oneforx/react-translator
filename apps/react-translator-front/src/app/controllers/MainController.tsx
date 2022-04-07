import { ReactTranslatorContext } from '@oneforx/react-translator';
import { useContext, useMemo } from 'react';
import { Link, Outlet } from 'react-router-dom'

const MainController = ( ) => {
  const { translated } = useContext(ReactTranslatorContext)
  const nvBarCn = useMemo(() => "md:px-32 flex justify-between", [])
  const nvItemCn = useMemo(() => "", []);

  return (
    <div className="h-full flex flex-col dark:bg-gray-900 dark:text-white">

      {/**#region Navbar */}
      <div className={nvBarCn}>
        <Link to="/" className="px-2 py-4">React Translator</Link>
        <div className="flex py-2">
          <Link to="/editor/last" className="py-2 md:px-4">{translated["my_editor_navbar_item_key"] || "My editor"}</Link>
          <Link to="/auth/signin" className="underline px-4 py-2 rounded mr-2">Connexion</Link>
          <Link to="/auth/signup" className="bg-teal-500 px-4 py-2 text-white rounded">Inscription</Link>
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
