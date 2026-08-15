import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn, UserPlus, Chrome } from 'lucide-react'
import { signUp, signIn, signInWithGoogle } from '../lib/storage'

export default function Auth() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
      navigate('/app')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    await signInWithGoogle()
  }

  return (
    <div className="min-h-screen bg-ink-900 text-white flex items-center justify-center px-4">
      <div className="fixed top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-ocean-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-400 to-cyan-500 mb-4">
            <LogIn size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            {isLogin ? 'Sign in to continue your journey' : 'Start your pronunciation journey'}
          </p>
        </div>

        <div className="rounded-2xl border border-ink-700/50 bg-ink-800/40 backdrop-blur-xl p-6 space-y-4">
          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-ink-700/50 bg-ink-900/50 py-2.5 text-sm font-medium text-white transition-all hover:bg-ink-800"
          >
            <Chrome size={18} />
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ink-700/50" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-ink-800 px-2 text-stone-500">or with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full rounded-xl border border-ink-700/50 bg-ink-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-stone-600 focus:border-ocean-500/50 focus:outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-xl border border-ink-700/50 bg-ink-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-stone-600 focus:border-ocean-500/50 focus:outline-none"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-ocean-500/25 transition-all hover:shadow-xl disabled:opacity-50"
            >
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="text-center text-xs text-stone-500">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-ocean-400 hover:text-ocean-300 font-medium"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/app')}
            className="text-xs text-stone-500 hover:text-stone-400 transition-colors"
          >
            Continue without account →
          </button>
        </div>
      </motion.div>
    </div>
  )
}