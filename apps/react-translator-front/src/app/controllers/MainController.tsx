import { useMemo } from 'react';
import { Outlet } from 'react-router-dom'

const MainController = ( ) => {
  const nvBarCn = useMemo(() => "flex justify-items-between", [])
  const nvItemCn = useMemo(() => "", []);

  return (
    <div className="h-full flex-row">

      {/**#region Navbar */}
      <div className={nvBarCn}>
        <div className="px-2">Logo</div>
        <div className="flex">
          <button className="bg-teal-500 px-2">Start</button>
          <button className="bg-teal-500 px-2">Start</button>
        </div>
      </div>
      {/**#endregion */}

      {/**#region Screens */}
      <div>
        <Outlet />
      </div>
      {/**#endregion */}
    </div>
  );
}

export default MainController
