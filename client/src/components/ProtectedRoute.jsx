import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import LoadingState from './LoadingState'
import { useAuth } from '../auth/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <LoadingState
        fullScreen
        title="Authenticating workspace"
        subtitle="Verifying your admin session before loading protected logistics data."
        steps={['Checking saved session', 'Validating backend token', 'Opening secured dashboard']}
      />
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export default ProtectedRoute
