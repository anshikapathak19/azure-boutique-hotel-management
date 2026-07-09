import { RouterProvider } from 'react-router-dom'
import router from '@/routes/AppRoutes.jsx'
import { AuthProvider } from '@/context/AuthContext.jsx'
import { ToastProvider } from '@/context/ToastContext.jsx'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  )
}