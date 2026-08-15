import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import AppDashboard from './pages/AppDashboard'
import Profile from './pages/Profile'
import LearningPath from './pages/LearningPath'
import Auth from './pages/Auth'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/app" element={<AppDashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/path" element={<LearningPath />} />
    </Routes>
  )
}

export default App