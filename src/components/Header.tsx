import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TbMenu } from "react-icons/tb";
import { RiUser6Fill } from "react-icons/ri";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

type HeaderProp = {
    isAuthenticated: boolean;
}
const Header: React.FC<HeaderProp> = ({ isAuthenticated }) => {
    const { setTheme } = useTheme()
    const navigate = useNavigate();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.log("Error signing out:", error.message);
        } else {
            navigate('/');
        }

    };

    return (
        <div className="flex justify-between dark:bg-[#18042b] bg-white items-center sm:px-10 px-3 py-4 shadow sticky top-0 z-50">
            <span className="font-semibold text-green-600 bg-green-200 px-5 py-1 rounded-sm sm:text-[16px] text-sm">NoteSync</span>
            <div className="flex items-center sm:gap-3 gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="dark:bg-[#161028]">
                        <DropdownMenuItem onClick={() => setTheme("light")} className="dark:hover:bg-input/30">
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")} className="dark:hover:bg-input/30">
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")} className="dark:hover:bg-input/30">
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                {isAuthenticated ? <div className="flex items-center gap-2 text-sm">
                    <Link to='/profile' className="hidden sm:flex rounded-full p-2 dark:bg-input/50 border duration-200 hover:bg-accent border-gray-300 dark:border-gray-800 text-gray-600 dark:text-white dark:hover:bg-input/30"><RiUser6Fill className="" size={18} /></Link>
                    <button className="hidden sm:flex bg-black dark:bg-input/50 dark:hover:bg-input/30 hover:bg-gray-900 duration-200 sm:px-4 px-3 py-1.5 rounded-sm text-white" onClick={handleLogout}>Logout</button>
                    <div className="flex sm:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <TbMenu size={24} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="dark:bg-[#161028]">
                                <DropdownMenuItem>
                                    <Link to='/profile' className="mx-auto rounded-full p-2 dark:bg-input/50 border duration-200 hover:bg-accent border-gray-300 dark:border-gray-800 text-gray-600 dark:text-white dark:hover:bg-input/30"><RiUser6Fill className="" size={18} /></Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="dark:hover:bg-input/30">
                                    <button className=" bg-black dark:bg-input/50 w-full dark:hover:bg-input/30 hover:bg-gray-900 duration-200 sm:px-4 px-3 py-1.5 rounded-sm text-white" onClick={handleLogout}>Logout</button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div> : <div className="flex sm:flex-row flex-col items-center sm:gap-3 gap-2 text-sm">
                    <Link to='/login' className="hidden sm:flex hover:bg-accent dark:hover:bg-input/50 duration-200 sm:px-4 px-3 py-1.5 rounded-sm border border-gray-300 dark:border-gray-800">Login</Link>
                    <Link to='/signup' className="hidden sm:flex bg-black dark:bg-input/50 dark:hover:bg-input/30 hover:bg-gray-900 duration-200 sm:px-4 px-3 py-1.5 rounded-sm text-white">Sign up</Link>
                    <div className="flex sm:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <TbMenu size={24} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="dark:bg-[#161028]">
                                <DropdownMenuItem className="dark:hover:bg-input/30">
                                    <Link to='/login' className="w-full">Login</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="dark:hover:bg-input/30">
                                    <Link to='/signup'>Sign up</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                }
            </div>
        </div>
    )
}

export default Header;
