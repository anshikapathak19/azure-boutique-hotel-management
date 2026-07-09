import { RouterProvider } from 'react-router-dom'
import router from '@/routes/AppRoutes.jsx'

export default function App() {
  return <RouterProvider router={router} />
}