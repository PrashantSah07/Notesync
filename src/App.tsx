import { Zap } from "lucide-react";
import Header from "./components/Header";
import TextType from './components/TextType';
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const App = () => {

  const [userSession, setUserSession] = useState<any>(null);
  const navigate = useNavigate();

  const fetchUserSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error(error.message);
    } else {
      setUserSession(data.session);
    }
  };

  useEffect(() => {
    fetchUserSession();
  }, []);

  useEffect(() => {
    if (userSession) navigate('/home')
  }, [userSession])

  return (
    <div className="max-w-[1550px] mx-auto">
      <Header isAuthenticated={false} />
      <div className="flex flex-col justify-center items-center min-h-[80vh]">
        <Zap className="w-12 h-12 text-yellow-400" />
        <TextType
          className="lg:text-7xl sm:text-6xl text-5xl sm:px-0 px-3 font-bold text-green-600 text-center"
          text={["Welcome to Notesync", "Login & Add Notes", "Save in Database"]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
          textColors={["#16a34a"]}
        />
      </div>
    </div>
  )
}

export default App
