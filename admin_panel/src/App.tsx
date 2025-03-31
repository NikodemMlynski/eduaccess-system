import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import Dashboard from './components/Dashboard/Dashboard'
import LoginPage from './pages/Authentication/LoginPage'
import AccessLogsPage from './pages/AccesLogs/AccessLogsPage'
import AdministratorsPage from './pages/Administrators/AdministratorsPage'
import AttendancesPage from './pages/Attendances/AttendancesPage'
import ClassesPage from './pages/Classes/ClassesPage'
import RoomsPage from './pages/Rooms/RoomsPage'
import SchedulesPage from './pages/Schedules/SchedulesPage'
import TeachersPage from './pages/Teachers/TeachersPage'
import StudentsPage from './pages/Students/StudentsPage'
import AuthLayout from './layouts/AuthLayout'
import ProtectedRoute from './components/Authorization/ProtectedRoute'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AuthLayout/>,
      children: [
        {path: 'signin', element: <LoginPage/> }
      ]
    },
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/',
          element: <RootLayout/>,
          children: [
            {
              index: true,
              element: <Dashboard/>
            },
            {
              path: 'signin',
              element: <LoginPage/>
            },
            {
              path: 'access-logs',
              element: <AccessLogsPage/>
            },
            {
              path: 'attendances',
              element: <AttendancesPage/>
            },
            {
              path: 'classes',
              element: <ClassesPage/>
            },
            {
              path: 'rooms',
              element: <RoomsPage/>
            },
            {
              path: 'schedules',
              element: <SchedulesPage/>
            },
            {
              path: 'teachers',
              element: <TeachersPage/>
            },
            {
              path: 'students',
              element: <StudentsPage/>
            },
            {
              path: 'administrators',
              element: <AdministratorsPage/>
            },
          ]
        },        
      ] 
    }
  ]
)

function App() {

  return (
    <RouterProvider router={router}/>
  )
}

export default App
