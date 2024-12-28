import React from 'react'
import { Button } from './components/ui/button'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { BrowserRouter,Router,Routes,Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Modal from './pages/modal'

const App = () => {
  return (
    <div>
      {/* <Login/> */}
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path='/dashboard' element = {<Dashboard/>}/>
        <Route path='/modal' element={<Modal/>}/>
      </Routes>
    </div>
  )
}

export default App
