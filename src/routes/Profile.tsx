import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Header from "@/components/Header";
import profile_photo from "@/assets/profile_photo.webp";
import { Link, useNavigate } from "react-router-dom";
import { LiaEditSolid } from "react-icons/lia";
import EditProfile from "@/components/EditProfile";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { IoSettingsOutline } from "react-icons/io5";

const ProfilePage = () => {
    const [isShow, setIsShow] = useState<boolean>(false);

    const navigate = useNavigate();

    const fetchUserSession = async () => {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
            navigate('/login');
        }
    };

    useEffect(() => {
        fetchUserSession();
    }, []);

    const [user, setUser] = useState<any>(null);
    const [profileImg, setProfileImg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [accDeleteLoading, setAccDeleteLoading] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true)
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.log("Auth error:", error.message);
            } else if (data.user) {
                setUser(data.user);
                setProfileImg(data.user.user_metadata?.avatar_url || null);
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const handleDeleteAccount = async () => {
        const confirms = confirm('This will delete your account permanently');
        if (!confirms) return;

        try {
            setAccDeleteLoading(true);
            const res = await fetch("https://notesyncc.vercel.app/delete-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user?.id, userEmail: user?.user_metadata?.email }),
            });

            const data = await res.json();

            if (res.ok) {
                await supabase.auth.signOut();
                alert("Your account has been deleted!");
                navigate("/login");
            } else {
                alert("Error deleting account: " + (data.error || "Unknown error"));
            }
        } catch (err: any) {
            console.log(err);
            alert("Something went wrong! Try again later.");
        } finally {
            setAccDeleteLoading(false);
        }
    }

    return (
        <div className="max-w-[1550px] mx-auto relative">
            <Header isAuthenticated={true} />

            <div className="absolute top-22 flex items-center justify-between px-5 w-full">
                <Link
                    to="/home"
                    className="border border-gray-200 bg-gray-50 hover:bg-accent dark:bg-input/20 dark:hover:bg-input/50 dark:border-gray-800 duration-200 px-5 py-2 rounded-sm text-[15px]">
                    Back
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <IoSettingsOutline />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="dark:bg-[#161028]">
                        <DropdownMenuItem className="p-0">
                            <button className={`${accDeleteLoading ? 'bg-red-400' : 'bg-red-500 hover:bg-red-600'} duration-200 w-full text-white rounded-sm p-1`} onClick={() => handleDeleteAccount()}>{accDeleteLoading ? 'Deleting...' : 'Delete Account'}</button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="sm:my-10 my-5 2xl:px-20 sm:px-10 px-3 mx-auto flex justify-center items-center lg:flex-row flex-col gap-8 w-full min-h-[70vh]">

                {loading ? <div className="flex flex-col gap-4 items-center h-fit py-10 md:px-40 md:w-fit w-full rounded-lg shadow dark:shadow-md dark:shadow-[#0f0b1d] bg-gray-50 dark:bg-[#090210] relative">
                    <div className="h-[100px] w-[100px] bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
                    <h1 className="h-[20px] w-[200px] bg-gray-300 dark:bg-gray-700 rounded-sm animate-pulse" />
                    <p className="h-[20px] w-[250px] bg-gray-300 dark:bg-gray-700 rounded-sm animate-pulse" />
                    <p className="h-[20px] w-[100px] bg-gray-300 dark:bg-gray-700 rounded-sm animate-pulse" />
                    <p className="h-[20px] w-[200px] bg-gray-300 dark:bg-gray-700 rounded-sm animate-pulse" />
                </div> :
                    <div className="flex flex-col gap-2 items-center h-fit py-10 md:px-40 md:w-fit w-full rounded-lg shadow dark:shadow-md dark:shadow-[#0f0b1d] bg-gray-50 dark:bg-[#090210] relative">
                        <button className="absolute right-3 shadow-md dark:shadow-[#1f1935] rounded-full p-2 flex justify-center items-center top-3" onClick={() => setIsShow(true)}><LiaEditSolid size={20} /></button>
                        <div className="border relative rounded-full max-w-[100px] h-[100px] p-1 w-full bg-gray-200 dark:bg-gray-800">
                            <img
                                src={profileImg || profile_photo}
                                alt="Profile"
                                onError={() => setProfileImg(null)}
                                className={`object-cover object-top h-full w-full rounded-full`}
                            />
                        </div>

                        {/* Profile Info */}
                        <h2 className="text-xl font-bold">{user?.user_metadata?.name}</h2>
                        <p className="text-gray-600">{user?.user_metadata?.email}</p>
                        <p className="mt-2">Age: {user?.user_metadata?.age}</p>
                        <p>Location: {user?.user_metadata?.location}</p>
                    </div>
                }
            </div>
            <EditProfile isShow={isShow} setIsShow={setIsShow} />
        </div>
    );
};

export default ProfilePage;
