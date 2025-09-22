import { useEffect, useState } from "react";
import Header from "../components/Header"
import { supabase } from '../lib/supabaseClient'
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

const Home = () => {
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

    interface Task {
        title: string,
        description: string,
    }

    interface UserTask {
        id: number,
        created_at: string,
        title: string,
        description: string,
    }

    const [task, setTask] = useState<Task>({ title: '', description: '' });
    const [userTask, setUserTask] = useState<UserTask[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loading2, setLoading2] = useState<boolean>(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [editTaskId, setEditTaskId] = useState<number | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            const { data, error } = await supabase.from("tasks").select("*").order('created_at', { ascending: false });

            if (error) {
                console.log(error.message);
                setFetchError(error.message);
            } else {
                setUserTask(data);
            }
            setLoading(false);
        };

        fetchTasks();
    }, []);

    const handleChange = (input: any) => {
        const { name, value } = input.target;
        setTask(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading2(true);

        if (editTaskId) {
            const { data, error } = await supabase.from('tasks').update({ title: task.title, description: task.description }).eq("id", editTaskId).select().single();
            if (error) {
                console.log(error.message)
            } else {
                setUserTask(prev =>
                    prev.map(t => (t.id === editTaskId ? data : t))
                );
                setEditTaskId(null);
            }
        } else {
            const { data, error } = await supabase.from('tasks').insert(task).select().single();
            if (error) {
                console.log(error.message);
            } else {
                setUserTask(prev => [...prev, data]);
            }
        }
        setLoading2(false)
        setTask({ title: '', description: '' });
    }

    function formateDate(data: string): string {
        const date = new Date(data);

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }

    const handleDeleteTask = async (id: number) => {
        const { error } = await supabase.from('tasks').delete().eq("id", id);
        if (error) {
            console.log(error);
        } else {
            setUserTask(prev => prev.filter(task => task.id !== id))
        }
    }

    const handleEditTask = (value: UserTask) => {
        setTask({ title: value.title, description: value.description });
        setEditTaskId(value.id);
    }

    return (
        <div className="max-w-[1550px] mx-auto">
            <Header isAuthenticated={true} />
            <div className="sm:my-10 my-5 2xl:px-20 sm:px-10 px-3 mx-auto flex lg:flex-row flex-col gap-8 w-full min-h-[80vh]">
                <form onSubmit={handleSubmit} className="lg:w-[40%]  w-full h-fit flex flex-col gap-3 shadow dark:shadow-[#0f0b1d] sm:p-5 p-3 rounded-md">
                    <input className="focus:outline-none focus:ring-2 transition focus:ring-blue-500 sm:px-5 px-3 py-2 outline rounded-sm outline-gray-300 dark:outline-gray-800" type="text" name="title" id="text" placeholder="Add title" value={task.title} onChange={(e) => handleChange(e)} required />
                    <textarea className="focus:outline-none focus:ring-2 transition focus:ring-blue-500 sm:px-5 px-3 py-2 md:min-h-[200px] min-h-[100px] outline outline-gray-300 dark:outline-gray-800 rounded-sm max-h-[400px]" name="description" id="description" placeholder="Add description" value={task.description} onChange={(e) => handleChange(e)} required></textarea>
                    <button disabled={loading2} type="submit" className="mt-3 outline rounded-sm py-2 bg-blue-800 text-white font-semibold hover:bg-blue-900 duration-200">{loading2 ? 'adding...' : <>{editTaskId ? "Update Task" : "Add Task"}</>}</button>
                </form>
                {userTask.length === 0 ?
                    <div className="lg:w-[60%] w-full flex justify-center p-3 shadow-md dark:shadow-[#0f0b1d] max-h-[80vh] overflow-auto scrollbar-none rounded-sm text-center text-gray-500">
                        {loading ? <Loading loopCount={5} /> : (
                            fetchError ?
                                <h1 className="text-2xl text-center text-red-500 font-semibold h-full py-10 flex justify-center items-center">{fetchError}</h1>
                                :
                                <h1 className="text-5xl h-full py-10 flex justify-center items-center font-semibold after:content-['Empty']" />
                        )
                        }
                    </div>
                    :
                    <div className="lg:w-[60%] w-full flex flex-col gap-3 max-h-[80vh] overflow-auto scrollbar-none p-3 rounded-sm shadow-md dark:shadow-[#0f0b1d]">
                        {userTask.map((value, index) => {
                            return <div key={index} className="bg-gray-100 dark:bg-[#161028] p-2 rounded-sm w-full flex lg:flex-row flex-col items-start gap-5 justify-between">
                                <div className="flex flex-col gap-2">
                                    <p className="text-gray-400 text-sm">{value.title}</p>
                                    <p>{value.description}</p>
                                    <p className="text-[12px] text-gray-400">Added on {formateDate(value.created_at)}</p>
                                </div>
                                <div className="flex items-center justify-end lg:w-fit w-full gap-1 text-sm">
                                    <button className="px-2 py-1 bg-green-500 hover:bg-green-600 duration-200 text-white font-medium rounded-sm" onClick={() => handleEditTask(value)}>Edit</button>
                                    <button className="px-2 py-1 bg-red-600 hover:bg-red-700 duration-200 text-white font-medium rounded-sm" onClick={() => handleDeleteTask(value.id)}>Delete</button>
                                </div>
                            </div>
                        })}
                    </div>
                }

            </div>
        </div>
    )
}

export default Home
