import { useCallback, useContext, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom"
import EditorContextProvider, { EditorContext } from "../contexts/EditorContext";
import { ReactComponent as MenuIconSVG } from '../assets/svg/menu.svg';

const EditorController = () => {
  const [ sidebarCollapsed, setSidebarCollapsed ] = useState( true );
  const { projects, selectProjectId, currentProjectId} = useContext(EditorContext);
  const navigate = useNavigate();

  const sbCn = useMemo(
    () => "border-r-2 border-gray-300 dark:border-gray-900 dark:bg-gray-900 flex flex-col justify-between",
    []
  );

  const sbItemCn = useMemo(
    () => "cursor-pointer hover:bg-gray-100 border-t-2 dark:border-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white ".concat( sidebarCollapsed ? "px-4 py-2 text-center" : "flex flex-row justify-items-center p-2" ),
    [ sidebarCollapsed ]
  );
  
  const selectSbElement = useCallback((text: string) => {
    selectProjectId(text);
    navigate("/editor/"+text)
  }, [selectProjectId, navigate]);

  const SbItemElement = useMemo(
    () => ({ icon, text }: { text: string, icon: string }) => {
      return <div className={ sbItemCn } onClick={() => selectSbElement(text)}>
        { sidebarCollapsed ? icon : <><div className="w-8 text-center">{icon}</div><div className={"w-32 text-center ".concat(currentProjectId === text ? "font-bold" :"")}>{text}</div></> }
      </div>
    },
  [ sidebarCollapsed, selectSbElement ]);

  return (
    <div className="h-full flex">

      {/**#region SideBar */}
      <div className={sbCn}>
        <div>
          { sidebarCollapsed ? <div className="p-2 border-black border-b-1 cursor-pointer bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"><MenuIconSVG width={32} className="px-1" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}/></div> : <div className={sbItemCn} onClick={() => setSidebarCollapsed(!sidebarCollapsed)}><MenuIconSVG width={32} className="px-1"/><div className="w-32 text-center">Menu</div></div> }
          { projects ? Object.keys(projects).map((project, idx) => {
            return <SbItemElement key={idx} icon="x" text={project} />
          }) : null }
        </div>
        <div>
          <div className={ sbItemCn } onClick={() => navigate("/editor/create")}>
            { sidebarCollapsed ? <span className="font-bold">+</span> : <><div className="w-8 text-center font-bold">{"+"}</div><div className="w-32 text-center">{"Create"}</div></> }
          </div>
          <div className={ sbItemCn } onClick={() => navigate("/")}>
            { sidebarCollapsed ? <span className="font-bold">h</span> : <><div className="w-8 text-center font-bold">{"H"}</div><div className="w-32 text-center">{"Leave"}</div></> }
          </div>
        </div>
      </div>
      {/**#endregion */}

      {/**#region Screens */}
      <Outlet />
      {/**#endregion */}
    </div>
  );
}

export default EditorController
