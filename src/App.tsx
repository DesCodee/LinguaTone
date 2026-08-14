import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import AppDashboard from './pages/AppDashboard'
import Profile from './pages/Profile'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<AppDashboard />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

export default App
