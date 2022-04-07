import { useLocalState, useRequest } from "@oneforx/poseidon";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import OauthPopup from 'react-oauth-popup';

const usePost = () => {
    return useRequest("/api/auth/signup", { mode: "cors", method: "POST" })
}

export const AuthSigninComponent = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [authResponse, postAuth] = usePost();
    const { pathname } = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [ accessToken, setAccessToken] = useLocalState("accessToken");

    const submit = useCallback(() => {
        postAuth({
            body: JSON.stringify({
                email,
                password,
                confirmPassword
            })
        });
    }, [email, password, confirmPassword])

    useEffect(() => {
        if (searchParams.get("error") === null) {
            if (searchParams.get("accessToken"))
                setAccessToken(searchParams.get("accessToken"))
        }
    }, [searchParams]);

    return (
        <form onSubmit={(e) => e.preventDefault()} className="py-4 px-4 w-[400px] shadow rounded-md">
            {
                accessToken ? "Already connected" : 
                <>
                    <h2 className="text-center text-3xl py-4 font-bold">Connexion</h2>
                    <div className="flex items-center justify-items-center justify-center">
                        <a href="http://localhost:3333/google" className="rounded-full border w-10 h-10 mr-2 cursor-pointer"></a>
                        <div className="rounded-full border w-10 h-10 mr-2 cursor-pointer"></div>
                        <div className="rounded-full border w-10 h-10 cursor-pointer"></div>
                    </div>

                    {error ? <div className="text-red">{error}</div> : null}
                    <label htmlFor="input-email">Email</label><br />
                    <input name="input" type="text" className="border rounded p-2 mb-2 mt-1 w-full" value={email} placeholder="Your email here" onChange={(e) => setEmail(e.target.value)}></input><br />
                    <label htmlFor="input-password">Password</label><br />
                    <input name="input-password" type="text" className="border rounded p-2 mb-2 mt-1 w-full" value={password} placeholder="Your password here" onChange={(e) => setPassword(e.target.value)}></input><br />
                    <label htmlFor="input-confirmPassword">Confirm Password</label><br />
                    <input name="input-confirmPassword" type="text" className="border rounded p-2 mb-2 mt-1 w-full" value={confirmPassword} placeholder="Your confirmPassword here" onChange={(e) => setConfirmPassword(e.target.value)}></input><br />

                    <div className="flex py-2 mt-4">
                        <button onClick={submit} className="flex-1 text-center bg-teal-500 text-white rounded-md py-2">Signin</button>
                        <Link to="/auth/signup" className="flex-1 text-center hover:underline py-2">Signup</Link>
                    </div>
                </>
            }
        </form>
    );
}

export default AuthSigninComponent