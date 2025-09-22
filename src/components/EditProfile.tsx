import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import profile_photo from "@/assets/profile_photo.webp";
import { supabase } from '@/lib/supabaseClient';

interface IsShow {
    isShow: boolean;
    setIsShow: (value: boolean) => void;
}

const EditProfile: React.FC<IsShow> = ({ isShow, setIsShow }) => {
    const [user, setUser] = useState<any>(null);
    const [profileImg, setProfileImg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imgChangeLoading, setImgChangeLoading] = useState(false);
    const [userId, setUserId] = useState('');
    const [name, setName] = useState<string>('');
    const [age, setAge] = useState<number | any>(null);
    const [location, setLocation] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true)
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.log("Auth error:", error.message);
            } else if (data.user) {
                setUser(data.user);
                setProfileImg(data.user.user_metadata?.avatar_url || null);
                setUserId(data.user.id);
                setName(data.user.user_metadata?.name)
                setAge(data.user.user_metadata?.age)
                setLocation(data.user.user_metadata?.location)
                setEmail(data.user.user_metadata?.email)
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user?.id) return;

        const localUrl = URL.createObjectURL(file);
        setProfileImg(localUrl);

        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/profile.${fileExt}`
        const filePath = `${fileName}`;

        setImgChangeLoading(true);
        const { error: uploadError } = await supabase.storage
            .from("profile_image")
            .upload(filePath, file, { cacheControl: "0", upsert: true, });

        setImgChangeLoading(false);
        if (uploadError) {
            console.log("Upload error:", uploadError.message);
            return;
        }

        const { data } = await supabase.storage.from("profile_image").getPublicUrl(filePath);
        const publicUrl = data.publicUrl;

        const { error: updateError } = await supabase.auth.updateUser({
            data: { avatar_url: publicUrl },
        });
        if (updateError) {
            console.log("Metadata update error:", updateError.message);
            return;
        }
        setProfileImg(publicUrl);
    };

    async function updateUser(
        userId: string,
        updates: { name: string; email: string; age: number, location: string }
    ) {
        try {
            setSaveLoading(true);
            const { error: tableError } = await supabase
                .from("users")
                .update({
                    name: updates.name,
                    email: updates.email,
                    age: updates.age,
                    location: updates.location
                })
                .eq("id", userId)
                .select();

            if (tableError) throw tableError;

            setSaveLoading(false);

            const { error: authError } = await supabase.auth.updateUser({
                data: {
                    name: updates.name,
                    email: updates.email,
                    age: updates.age,
                    location: updates.location
                }
            });

            if (authError) throw authError;

        } catch (err: any) {
            console.error("Error updating user:", err.message);
        }
    }

    const handlePhotoDelete = async () => {
        if (!profileImg) return;

        const path = profileImg.split('/storage/v1/object/public/profile_image/')[1];

        if (!path) return;

        const { error } = await supabase
            .storage
            .from('profile_image')
            .remove([path]);

        if (error) {
            console.log('Error deleting file:', error.message);
        } else {
            setProfileImg(null);
            await supabase.auth.updateUser({ data: { avatar_url: null } });
        }
    }

    return (
        <AnimatePresence>
            {isShow && (
                <motion.div
                    className="w-[100vw] h-[100vh]  backdrop-blur-[2px] flex justify-center items-center bg-black/70 fixed top-0 left-0 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setIsShow(false)} >
                    <motion.div
                        className="max-w-[1000px] max-h-[550px] mx-3 lg:p-10 gap-5 rounded-2xl flex flex-col justify-center items-center w-full h-full bg-white dark:bg-gray-900"
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}>

                        {loading ? <div className='w-full h-full flex gap-5 flex-col justify-center items-center'>
                            <div className="flex flex-col gap-5 items-center md:w-[60%] sm:w-[80%] w-[90%]">
                                <div className="h-[150px] w-[150px] bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
                                <h1 className="h-[40px] w-[100%] bg-gray-300 dark:bg-gray-700 rounded-sm animate-pulse" />
                                <p className="h-[40px] w-[100%] bg-gray-300 dark:bg-gray-700 rounded-sm animate-pulse" />
                                <p className="h-[40px] w-[100%] bg-gray-300 dark:bg-gray-700 rounded-sm animate-pulse" />
                                <p className="h-[40px] w-[100%] bg-gray-300 dark:bg-gray-700 rounded-sm animate-pulse" />
                            </div>
                            <div className='w-full flex justify-end items-center lg:pr-0 sm:pr-10 pr-6'>
                                <button className='bg-gray-300 dark:bg-gray-700 animate-pulse h-[36px] w-[140px] rounded-sm' />
                            </div>
                        </div> :
                            <>
                                <div className='flex items-center gap-4 relative'>
                                    <div className="border rounded-full w-[150px] h-[150px] p-1 cursor-pointer bg-gray-200 dark:bg-gray-800"
                                        onClick={(e) => {
                                            if (imgChangeLoading) {
                                                e.preventDefault();
                                            }
                                            fileInputRef.current?.click();
                                        }}>
                                        <img
                                            src={profileImg || profile_photo}
                                            alt="Profile"
                                            onError={() => setProfileImg(null)}
                                            className={`object-cover object-top h-full w-full rounded-full ${imgChangeLoading && 'opacity-40'}`}
                                        />
                                        {imgChangeLoading && <div className="lds-spinner text-[6px] absolute top-15 left-9">{new Array(12).fill(null).map((_, i) => {
                                            return <div key={i}></div>
                                        })}</div>}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={onFileChange}
                                        />
                                    </div>
                                    <button disabled={imgChangeLoading} className={`absolute bottom-2 -right-12 text-[12px] w-fit flex items-center gap-1 px-1.5 py-0.5 ${imgChangeLoading ? 'bg-red-300' : 'bg-red-400 hover:bg-red-500'}  duration-200 rounded-sm text-white`} onClick={() => handlePhotoDelete()}>
                                        Remove
                                    </button>
                                </div>

                                <div className='flex flex-col gap-5  md:w-[60%] sm:w-[80%] w-[90%]'>
                                    <div >
                                        <input
                                            type="text"
                                            placeholder=""
                                            id='name'
                                            value={name}
                                            className="focus:outline-none w-full font-normal focus:ring-2 transition focus:ring-blue-500 px-3 py-2 outline rounded-sm bg-gray-50 dark:bg-gray-800 outline-gray-300 dark:outline-gray-800"
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            placeholder=""
                                            id='email'
                                            value={email}
                                            className="focus:outline-none w-full font-normal focus:ring-2 transition focus:ring-blue-500 px-3 py-2 bg-gray-50 dark:bg-gray-800 outline rounded-sm outline-gray-300 dark:outline-gray-800"
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />

                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            placeholder=""
                                            id='age'
                                            value={age || ''}
                                            className="focus:outline-none bg-gray-50 dark:bg-gray-800 font-normal w-full focus:ring-2 transition focus:ring-blue-500 px-3 py-2 outline rounded-sm outline-gray-300 dark:outline-gray-800"
                                            onChange={(e) => setAge(Number(e.target.value))}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            placeholder=""
                                            id='location'
                                            value={location}
                                            className="focus:outline-none bg-gray-50 dark:bg-gray-800 font-normal w-full focus:ring-2 transition focus:ring-blue-500 px-3 py-2 outline rounded-sm outline-gray-300 dark:outline-gray-800"
                                            onChange={(e) => setLocation(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='w-full flex justify-end items-center lg:pr-0 sm:pr-10 pr-6' onClick={(e) => {
                                    if (saveLoading) {
                                        e.preventDefault()
                                    }
                                    updateUser(userId, { name, email, age, location })
                                }}>
                                    <button className={`bg-blue-500 ${saveLoading ? 'opacity-70' : 'opacity-100'} text-white text-sm px-6 py-2 rounded-sm w-fit ${saveLoading ? 'hover:bg-blue-500' : 'hover:bg-blue-600'} duration-200`}>{saveLoading ? 'Saving...' : 'Save Changes'}</button>
                                </div>
                            </>
                        }

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EditProfile;
