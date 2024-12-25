import React, { useState, useContext } from "react";
import axios from 'axios'
import Cookies from 'js-cookie';
import { AppRoutes } from '../constant/AppRoutes'
import { AuthContext } from '../context/AuthContext'

const AuthPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [fullname, setfullname] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, seterror] = useState('')
    const { setUser } = useContext(AuthContext)

    const handleSubmitForm = (e) => {
        e.preventDefault()
        if (isSignUp) {
            const obj = {
                fullName: e.target[0].value,
                email: e.target[1].value,
                password: e.target[2].value
            }
            setLoading(true)
            axios.post(AppRoutes.register, obj).then((data) => {
                setLoading(false)
                setpassword('')
                setemail('')
                setfullname('')
                setIsSignUp(false)
            }).catch((err) => {
                console.log("err=>", err)
                seterror(err.message == 'Request failed with status code 403' ? err.response.data.message : err.message)
                setLoading(false)
            })

        }
        else {
            const obj = {
                email: e.target[0].value,
                password: e.target[1].value
            }
            setLoading(true)
            axios.post(AppRoutes.login, obj).then((data) => {
                Cookies.set("token", data?.data?.data?.token)
                setUser(data?.data?.data?.user)
                setLoading(false)
            }).catch((err) => {
                console.log("err=>", err)
                seterror(err.message == 'Request failed with status code 403' ? err.response.data.message : err.message)
                setLoading(false)
            })

        }


    }

    const toggleAuthMode = () => {
        setIsSignUp((prev) => !prev);
        setemail('')
        setfullname('')
        setpassword('')
        seterror('')
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 w-96">
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    {isSignUp ? "Sign Up" : "Login"}
                </h2>
                <form onSubmit={handleSubmitForm} className="mt-6 space-y-4">
                    {isSignUp && (
                        <div>
                            <label className="block text-gray-600 mb-1" htmlFor="fullname">
                                Full Name
                            </label>
                            <input
                                required
                                value={fullname}
                                onChange={(e) => { setfullname(e.target.value), seterror('') }}
                                type="text"
                                id="fullname"
                                name="fullName"
                                placeholder="Enter your full name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-gray-600 mb-1" htmlFor="email">
                            Email
                        </label>
                        <input
                            required
                            value={email}
                            onChange={(e) => { setemail(e.target.value), seterror('') }}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            required
                            value={password}
                            onChange={(e) => { setpassword(e.target.value), seterror('') }}
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : isSignUp ? "Sign Up" : "Login"}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    {
                        error ? <div className="text-red-500">Error : {error}</div> : null
                    }
                    <button
                        type="button"
                        className="text-blue-500 hover:text-blue-300"
                        onClick={toggleAuthMode}

                    >
                        {isSignUp
                            ? "Already have an account? Login"
                            : "Don't have an account? Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
