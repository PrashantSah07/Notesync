import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isShow, setIsShow] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const navigate = useNavigate();
  const [isShowMessage, setIsShowMessage] = useState<boolean>(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const fetchUserSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      navigate('/home');
    }
  };

  useEffect(() => {
    fetchUserSession();
  }, []);


  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/forgot-password`
    });

    if (error) {
      console.log(error.message);
      setErrorMsg(error.message);
    } else {
      setIsShowMessage(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsShowMessage(false);
        setIsShow(true);
      }
    });
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);


  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setErrorMsg('password not matched');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      console.error(error.message);
      setErrorMsg(error.message);
    }
    else {
      alert('Password updated successfully!');
      await supabase.auth.signOut();
      navigate('/login')
    }
    setLoading(false);
  };



  return (
    <div className="flex relative justify-center items-center min-h-screen px-3 max-w-[1550px] mx-auto">
      <div className="absolute top-5 left-5">
        <Link to='/' className="border border-gray-200 bg-gray-50 hover:bg-accent dark:bg-input/20 dark:hover:bg-input/50 dark:border-gray-800 duration-200 px-5 py-2 rounded-sm text-[15px]">Back</Link>
      </div>
      {!isShow ?
        <>
          {!isShowMessage ? <form
            onSubmit={handleSendLink}
            className="bg-white dark:bg-[#161028] shadow-md p-5 rounded-md w-[450px] flex flex-col gap-3">
            <h1 className="text-xl font-bold text-center">Forgot Password</h1>
            {errorMsg && (
              <p className="text-red-600 text-sm text-left">{errorMsg}</p>
            )}

            <input
              type="email"
              placeholder="example@gmail.com"
              className="focus:outline-none focus:ring-2 transition focus:ring-blue-500 px-5 py-2 outline rounded-sm outline-gray-300 dark:outline-gray-800"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMsg('');
              }}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition mt-3">
              {loading ? "Sending..." : "Send"}
            </button>
          </form> :
            <div className="bg-white dark:bg-[#161028] shadow-md sm:p-10 p-5 rounded-md w-[450px] flex flex-col gap-3">
              <h1 className="text-xl font-bold text-center text-green-600">
                Reset Email Sent
              </h1>
              <p className="text-center border border-gray-300 dark:border-gray-800 p-3 text-sm rounded-sm">
                We’ve sent you a password reset email. Please check your inbox and click the link to securely reset your password.
              </p>

            </div>
          }
        </> :
        <form
          onSubmit={handleForgotPassword}
          className="bg-white dark:bg-[#161028] shadow-md p-5 rounded-md w-[450px] flex flex-col gap-3">
          <h1 className="text-xl font-bold text-center">Please enter a new password</h1>
          {errorMsg && (
            <p className="text-red-600 text-sm text-left">{errorMsg}</p>
          )}

          <div className="relative w-full">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Enter new password"
              className="focus:outline-none focus:ring-2 w-full transition focus:ring-blue-500 px-5 py-2 outline rounded-sm outline-gray-300 dark:outline-gray-800"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMsg('');
              }}
              required
            />
            <button type="button" className="rounded-sm p-1 absolute right-2 top-[5px]" onClick={() => setShowPass(!showPass)}>{showPass ? <VscEyeClosed size={20} /> : <VscEye size={20} />}</button>
          </div>
          <div className="relative w-full">
            <input
              type={showConfirmPass ? 'text' : 'password'}
              placeholder="Enter new confirm password"
              className="focus:outline-none focus:ring-2 w-full transition focus:ring-blue-500 px-5 py-2 outline rounded-sm outline-gray-300 dark:outline-gray-800"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrorMsg('');
              }}
              required
            />
            <button type="button" className="rounded-sm p-1 absolute right-2 top-[5px]" onClick={() => setShowConfirmPass(!showConfirmPass)}>{showPass ? <VscEyeClosed size={20} /> : <VscEye size={20} />}</button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition mt-3">
            {loading ? "Saving..." : "Save"}
          </button>
        </form>}
    </div>
  );
};

export default ForgotPassword;
