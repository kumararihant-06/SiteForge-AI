import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Community from "./pages/Community"
import Preview from "./pages/Preview"
import Projects from "./pages/Projects"
import ProtectedRoute from "./components/ProtectedRoute"
import Builder from "./pages/Builder"
import Pricing from "./pages/Pricing"
import Settings from "./pages/Settings"

const App = () => {
  return (
    <Routes>
      {/* Public Routes No Authentication needed*/ }
      <Route path = "/" element={<Home/>}/>
      <Route path = "/login" element={<Login/>}/>
      <Route path = "/signup" element={<Signup/>}/>
      <Route path = "/community" element={<Community/>}/>
      <Route path = "/preview/:projectId" element={<Preview/>}/>

      {/* Protected Routes need authentication */}
      <Route path = "/projects" element={<ProtectedRoute><Projects/></ProtectedRoute>}/>
      <Route path = "/builder/:projectId" element={<ProtectedRoute><Builder/></ProtectedRoute>}/>
      <Route path = "/pricing" element={<ProtectedRoute><Pricing/></ProtectedRoute>}/>
      <Route path = "/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>}/>
    </Routes>
  )
}

export default App