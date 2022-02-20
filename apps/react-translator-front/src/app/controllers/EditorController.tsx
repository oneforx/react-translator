import { useContext, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom"
import EditorContextProvider, { EditorContext } from "../contexts/EditorContext";
import { ReactComponent as MenuIconSVG } from '../assets/svg/menu.svg';

const EditorController = () => {
  const [ sidebarCollapsed, setSidebarCollapsed ] = useState( true );
  const { projects } = useContext(EditorContext);
  const navigate = useNavigate();

  const sbCn = useMemo(
    () => "border-r border-gray-300 flex flex-col",
    []
  );

  const sbItemCn = useMemo(
    () => "cursor-pointer hover:bg-gray-100 ".concat( sidebarCollapsed ? "px-4 py-2 text-center" : "flex flex-row justify-items-center p-2" ),
    [ sidebarCollapsed ]
  );

  const SbItemElement = useMemo(
    () => ({ icon, text }: { text: string, icon: string }) => {
      return <div className={ sbItemCn } onClick={() => navigate("/editor/"+text)}>
        { sidebarCollapsed ? icon : <><div className="w-8 text-center">{icon}</div><div className="w-32 text-center">{text}</div></> }
      </div>
    },
  [ sidebarCollapsed ]);

  return (
    <div className="h-full flex">

      {/**#region SideBar */}
      <div className={sbCn}>
        { sidebarCollapsed ? <div className="p-2 border-black border-b-1 cursor-pointer bg-gray-100"><MenuIconSVG width={32} className="px-1" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}/></div> : <div className={sbItemCn} onClick={() => setSidebarCollapsed(!sidebarCollapsed)}><MenuIconSVG width={32} className="px-1"/><div className="w-32 text-center">Menu</div></div> }
        { projects ? Object.keys(projects).map((project, idx) => {
          return <SbItemElement key={idx} icon="x" text={project} />
        }) : null }
      </div>
      {/**#endregion */}

      {/**#region Screens */}
      <Outlet />
      {/**#endregion */}
    </div>
  );
}

export default EditorController
