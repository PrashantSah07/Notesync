import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Login from '@/routes/Login.tsx'
import SignUp from '@/routes/SignUp.tsx'
import ForgotPassword from '@/routes/ForgotPassword.tsx'
import Home from '@/routes/Home.tsx'
import Profile from '@/routes/Profile.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/home' element={<Home />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
)
