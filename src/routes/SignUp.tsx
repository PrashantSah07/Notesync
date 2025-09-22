import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { FcGoogle } from "react-icons/fc";

const SignUp = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [location, setLocation] = useState('');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);

    const fetchUserSession = async () => {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
            navigate('/home');
        }
    };

    useEffect(() => {
        fetchUserSession();
    }, []);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: authUser, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    age,
                    location,
                },
            },
        });

        if (error) {
            console.log(error.message);
            setErrorMsg(error.message)
        } else {
            alert("Check your email for confirmation link!");
        }
        if (!error && authUser.user) {
            const { error: insertError } = await supabase.from("users").insert({
                id: authUser.user.id,  
                name,
                email,
                age: Number(age),       
                location,
            });
            if (insertError) console.log("Insert Error:", insertError.message);
        }
        setLoading(false);
    };

    const signUpWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/home`,
            },
        });
        if (error) {
            console.log(error);
            setErrorMsg(error.message);
        } else {
            window.location.href = data.url;
        }
    };


    return (
        <div className="flex relative justify-center items-center min-h-screen px-3 max-w-[1550px] mx-auto">
            <div className="absolute top-5 left-5">
                <Link to='/' className="border border-gray-200 bg-gray-50 hover:bg-accent dark:bg-input/20 dark:hover:bg-input/50 dark:border-gray-800 duration-200 px-5 py-2 rounded-sm text-[15px]">Back</Link>
            </div>
            <form
                onSubmit={handleSignUp}
                className="bg-white dark:bg-[#161028] shadow-md p-5 rounded-md w-[450px] flex flex-col gap-3">
                <h1 className="text-xl font-bold text-center">Sign Up</h1>
                {errorMsg && (
                    <p className="text-red-600 text-sm text-left">{errorMsg}</p>
                )}
                <input
                    type="text"
                    placeholder="Name"
                    className="focus:outline-none focus:ring-2 transition focus:ring-blue-500 px-5 py-2 outline rounded-sm outline-gray-300 dark:outline-gray-800"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setErrorMsg('');
                    }}
                    required
                />
                <input
                    type="text"
                    placeholder="Age"
                    className="focus:outline-none focus:ring-2 transition focus:ring-blue-500 px-5 py-2 outline rounded-sm outline-gray-300 dark:outline-gray-800"
                    value={age}
                    onChange={(e) => {
                        setAge(e.target.value);
                        setErrorMsg('');
                    }}
                    required
                />
                <input
                    type="text"
                    placeholder="Location"
                    className="focus:outline-none focus:ring-2 transition focus:ring-blue-500 px-5 py-2 outline rounded-sm outline-gray-300 dark:outline-gray-800"
                    value={location}
                    onChange={(e) => {
                        setLocation(e.target.value);
                        setErrorMsg('');
                    }}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="focus:outline-none focus:ring-2 transition focus:ring-blue-500 px-5 py-2 outline rounded-sm outline-gray-300 dark:outline-gray-800"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMsg('');
                    }}
                    required
                />
                <div className="relative w-full">
                    <input
                        type={showPass ? 'text' : 'password'}
                        placeholder="Password"
                        className="focus:outline-none w-full focus:ring-2 transition focus:ring-blue-500 px-5 pr-14 py-2 outline rounded-sm outline-gray-300 dark:outline-gray-800"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrorMsg('');
                        }}
                        required
                    />
                    <button type="button" className="rounded-sm p-1 absolute right-2 top-[5px]" onClick={() => setShowPass(!showPass)}>{showPass ? <VscEyeClosed size={20} /> : <VscEye size={20} />}</button>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white mt-3 font-semibold py-2 rounded-md transition">
                    {loading ? "Signing Up..." : "Sign Up"}
                </button>
                <button
                    type="button"
                    disabled={loading}
                    className="font-semibold py-1.5 bg-gray-100 gap-2 hover:bg-gray-200 dark:bg-gray-800 duration-200 dark:hover:bg-[#1d242f] rounded-md transition border flex justify-center items-center" onClick={signUpWithGoogle}>
                    Sign up with Google
                    <FcGoogle size={22} />
                </button>
                <p className="text-sm">Already have an account? <Link to='/login' className="hover:underline text-blue-500 pl-1">Login</Link> </p>
            </form>
        </div>
    );
};

export default SignUp;
