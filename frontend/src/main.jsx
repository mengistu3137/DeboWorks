import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import '@fontsource/inter'
import '@fontsource/roboto'
import '@fontsource/poppins'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Homepage from './routes/HomePage.jsx'
import Postlistpage from './routes/PostListPage.jsx'
import Write from './routes/Write.jsx'
import LoginPage from './routes/LoginPage.jsx'
import RegisterPage from './routes/RegisterPage.jsx'
import Singlepostpage from './routes/SinglePostPage.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { ToastContainer } from 'react-toastify'
import ProfileFormPage from './routes/ProfileFormPage.jsx'
// import AdminPage from  "./routes/AdminPage.jsx"
import ApplicationListPage from './routes/ApplicationListPage.jsx'
import ProfileViewPage from './routes/ProfileViewPage.jsx'
import Home from './routes/Home.jsx'
import AdiminLayout2 from './layouts/AdminLayout2.jsx'
import { UsageProvider } from './contexts/UsageContext.jsx'
import FilterPage from './routes/FilterPage.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
}

const queryClient = new QueryClient()

const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <Homepage />,
            },

            {
                path: '/:slug',
                element: <Singlepostpage />,
            },

            {
                path: '/login',
                element: <LoginPage />,
            },

            {
                path: '/applicants',
                element: <LoginPage />,
            },
            {
                path: '/filter',
                element: <FilterPage />,
            },
            {
                path: '/profile-form',
                element: <ProfileFormPage />,
            },
            {
                path: '/profile-form/:slug',
                element: <ProfileFormPage/>,
            },
            {
                path: '/:slug/profile-view',
                element: <ProfileViewPage />,
            },
           
            
        ],
    },

    {
        path: '/home',
        element: <AdiminLayout2 />,
        children: [
            {
                path: '/home',
                element: <Home />,
            },
            {
                path: '/home/applicants',
                element: <ApplicationListPage />,
            },
            {
                path: '/home/posts',
                element: <Postlistpage />,
            },
            {
                path: '/home/posts/write',
                element: <Write />,
            },
            {
                path: '/home/write/:slug',
                element: <Write />,
            },
          
        ],
    },

    {
        element: <AdiminLayout2 />,
        children: [
           
            {
                path: '/write',
                element: <Write />,
            },
            {
                path: '/write/:slug',
                element: <Write />,
            },
           
        ],
    },
])

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <UsageProvider>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router} />
                    <ToastContainer position="top-center" />
                </QueryClientProvider>
            </UsageProvider>
        </ClerkProvider>
    </StrictMode>,
)
