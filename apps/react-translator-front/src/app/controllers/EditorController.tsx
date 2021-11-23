import { useMemo, useState } from "react";
import { Outlet } from "react-router-dom"
import EditorContextProvider from "../contexts/EditorContext";

const EditorController = () => {
  const [ sidebarCollapsed, setSidebarCollapsed ] = useState( true );

  const sbCn = useMemo(
    () => "border-r border-gray-300 flex flex-col"
  , [ sidebarCollapsed ]);

  const sbItemCn = useMemo(
    () => "cursor-pointer hover:bg-gray-100 ".concat( sidebarCollapsed ? "px-4 py-2 text-center" : "flex flex-row" )
  , [ sidebarCollapsed ]);

  const SbItemElement = useMemo(
    () => ({ icon, text }: { text: string, icon: string }) => {
      return <div className={ sbItemCn }>
        { sidebarCollapsed ? icon : <><div>{text}</div><div>{icon}</div></> }
      </div>
    },
  [ sidebarCollapsed ]);

  return (
    <div className="h-full flex">

      {/**#region SideBar */}
      <div className={sbCn} >
        <SbItemElement icon="x" text="Ofx" />
        <SbItemElement icon="x" text="Ofx" />
      </div>
      {/**#endregion */}

      {/**#region Screens */}
      <div>
        <EditorContextProvider>
          <Outlet />
        </EditorContextProvider>
      </div>
      {/**#endregion */}

    </div>
  );
}

export default EditorController
