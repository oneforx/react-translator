import { useRequest } from "@oneforx/poseidon";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const usePost = () => {
    return useRequest( "/api/auth/signup", { mode: "cors", method: "POST" })
}

const AuthSignupComponent = () => {
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ confirmPassword, setConfirmPassword ] = useState("")
    const [ error, setError ] = useState("")
    const [ authResponse, postAuth ] = usePost();

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
        console.log(authResponse);
    }, [authResponse])

    return (
        <form onSubmit={(e) => e.preventDefault()} className="p-4 shadow-sm">
            <h2 className="text-center text-3xl py-4 font-bold">Inscription</h2>
            {error ? <div className="text-red">{error}</div> : null}
            <label htmlFor="input-email">Email</label><br/>
            <input name="input" type="text" className="border p-2 mb-2" value={email} placeholder="Your email here" onChange={(e) => setEmail(e.target.value)}></input><br/>
            <label htmlFor="input-password">Password</label><br/>
            <input name="input-password" type="text" className="border p-2 mb-2" value={password} placeholder="Your password here" onChange={(e) => setPassword(e.target.value)}></input><br/>
            <label htmlFor="input-confirmPassword">Confirm Password</label><br/>
            <input name="input-confirmPassword" type="text" className="border p-2 mb-2" value={confirmPassword} placeholder="Your confirmPassword here" onChange={(e) => setConfirmPassword(e.target.value)}></input><br/>
            
            <div className="flex py-2">
                <Link to="/auth/signin"  className="flex-1 text-center hover:underline py-2">Signin</Link>
                <button onClick={submit} className="flex-1 text-center bg-teal-500 text-white rounded-md py-2">Signup</button>
            </div>
        </form>
    );
}

export default AuthSignupComponent