import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import './App.css'
import AuthPage from './pages/AuthPage'
import { AuthContext } from './context/AuthContext'
import { useContext } from 'react'
import Todos from './pages/Todos'

function App() {
  const { user } = useContext(AuthContext)
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={user ? <Navigate to={'/todos'} /> : <AuthPage />} />
      <Route path='/todos' element={!user ? <Navigate to={'/'} /> : <Todos />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
