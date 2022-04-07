import { Outlet } from "react-router-dom"

export const AuthController = () => {
    return (
        <div className="flex flex-1 items-center justify-items-center justify-center">
            <Outlet />
        </div>
    )
}

export default AuthController