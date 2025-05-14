import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import Dashboard from './components/Dashboard/Dashboard'
import LoginPage from './pages/Authentication/LoginPage'
import AccessLogsPage from './pages/AccesLogs/AccessLogsPage'
import AdministratorsPage from './pages/Administrators/AdministratorsPage'
import AttendancesPage from './pages/Attendances/AttendancesPage'
import ClassesPage from './pages/Classes/ClassesPage'
import RoomsPage from './pages/Rooms/RoomsPage'
import {SchedulesPage} from './pages/Schedules/SchedulesPage'
import TeachersPage from './pages/Teachers/TeachersPage'
import StudentsPage from './pages/Students/StudentsPage'
import AuthLayout from './layouts/AuthLayout'
import ProtectedRoute from './components/Authorization/ProtectedRoute'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthProvider'
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
import {ToastContainer} from "react-toastify";
import StudentPage from './pages/Students/StudentPage'
import ScheduleRoomPage from "@/pages/Schedules/ScheduleRoomPage.tsx";
import ScheduleClassPage from "@/pages/Schedules/ScheduleClassPage.tsx";
import ScheduleTeacherPage from "@/pages/Schedules/ScheduleTeacherPage.tsx";
import LessonInstanceTeacherPage from "@/pages/Schedules/LessonInstanceTeacherPage.tsx";
import LessonInstanceClassPage from "@/pages/Schedules/LessonInstanceClassPage.tsx";
import LessonInstanceRoomPage from "@/pages/Schedules/LessonInstanceRoomPage.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AuthProvider><AuthLayout/></AuthProvider>,
      children: [
        {path: 'signin', element: <LoginPage/> }
      ]
    },
    {
      path: '/',
      element: <AuthProvider><ProtectedRoute /></AuthProvider>,
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
              children: [
                {
                  index: true,
                  element: <SchedulesPage/>
                },
                {
                  path: 'rooms/:roomId',
                  element: <ScheduleRoomPage/>
                },
                {
                  path: 'classes/:classId',
                  element: <ScheduleClassPage/>
                },
                {
                  path: 'teachers/:teacherId',
                  element: <ScheduleTeacherPage/>
                },
                {
                  path: 'teachers/:teacherId/dateStr/:dateStr',
                  element: <LessonInstanceTeacherPage/>
                },
                {
                  path: 'classes/:classId/dateStr/:dateStr',
                  element: <LessonInstanceClassPage/>
                },
                {
                  path: 'rooms/:roomId/dateStr/:dateStr',
                  element: <LessonInstanceRoomPage/>
                },
              ]
            },
            {
              path: 'teachers',
              element: <TeachersPage/>
            },
            {
              path: 'students',
              children: [
                {
                  index: true,
                  element: <StudentsPage/>
                },
                {
                  path: ':id',
                  element: <StudentPage/>
                }
              ]
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
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}/>
        <ToastContainer
        autoClose={1500}
        />
        <ReactQueryDevtools/>
      </QueryClientProvider>
  )
}

export default App
