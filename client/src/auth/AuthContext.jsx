/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  clearStoredSession,
  getCurrentUser,
  getStoredToken,
  getStoredUser,
  loginWithPassword,
  loginWithGoogleCredential,
  signupWithPassword,
  persistSession
} from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser())
  const [token, setToken] = useState(getStoredToken())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const bootstrap = async () => {
      const existingToken = getStoredToken()

      if (!existingToken) {
        setLoading(false)
        return
      }

      try {
        const response = await getCurrentUser()
        setUser(response.user)
        setToken(existingToken)
        persistSession({ token: existingToken, user: response.user })
      } catch {
        clearStoredSession()
        setUser(null)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }

    bootstrap()
  }, [])

  useEffect(() => {
    const handleSessionCleared = () => {
      setUser(null)
      setToken(null)
    }

    window.addEventListener('delayshield:session-cleared', handleSessionCleared)
    return () => window.removeEventListener('delayshield:session-cleared', handleSessionCleared)
  }, [])

  const signInWithGoogle = async (credential) => {
    const response = await loginWithGoogleCredential(credential)
    persistSession(response)
    setUser(response.user)
    setToken(response.token)
    return response
  }

  const signInWithEmail = async (payload) => {
    const response = await loginWithPassword(payload)
    persistSession(response)
    setUser(response.user)
    setToken(response.token)
    return response
  }

  const signUpWithEmail = async (payload) => {
    const response = await signupWithPassword(payload)
    persistSession(response)
    setUser(response.user)
    setToken(response.token)
    return response
  }

  const logout = () => {
    clearStoredSession()
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(token && user),
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
