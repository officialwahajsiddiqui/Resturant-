import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import './App.css'
import { AuthProvider } from './context/AuthContext'

// Lazy load components for better performance
const Login = lazy(() => import('./components/auth/Login'))
const Signup = lazy(() => import('./components/auth/Signup'))
const Main = lazy(() => import('./components/Main'))
const Team = lazy(() => import('./components/Teams'))
const Testimonial = lazy(() => import('./components/Testimonial'))
const About = lazy(() => import('./components/About'))
const Service = lazy(() => import('./components/Service'))
const Menu = lazy(() => import('./components/Menu'))
const Booking = lazy(() => import('./components/Booking'))
const Contact = lazy(() => import('./components/Contact'))
const Admin = lazy(() => import('./components/admin/Admin'))
const Dashboard = lazy(() => import('./components/admin/Dashboard'))
const AdminBooking = lazy(() => import('./components/admin/booking'))
const AddMenu = lazy(() => import('./components/admin/AddMenu'))
const AllMenus = lazy(() => import('./components/admin/AllMenus'))
const EditMenu = lazy(() => import('./components/admin/EditMenu'))

// Loading component
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
)

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <Main />
        </Suspense>
      )
    },
    {
      path: '/about',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <Layout>
            <About />
          </Layout>
        </Suspense>
      )
    },
    {
      path: '/service',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <Layout>
            <Service />
          </Layout>
        </Suspense>
      )
    },
    {
      path: '/menu',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <Layout>
            <Menu />
          </Layout>
        </Suspense>
      )
    },
    {
      path: '/booking',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <Layout>
            <Booking />
          </Layout>
        </Suspense>
      )
    },
    {
      path: '/team',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <Layout>
            <Team />
          </Layout>
        </Suspense>
      )
    },
    {
      path: '/testimonial',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <Layout>
            <Testimonial />
          </Layout>
        </Suspense>
      )
    },
    {
      path: '/contact',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <Layout>
            <Contact />
          </Layout>
        </Suspense>
      )
    },
    {
      path: '/login',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <Login />
        </Suspense>
      )
    },
    {
      path: '/register',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <Signup />
        </Suspense>
      )
    },
    {
      path: '/admin/dashboard',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        </Suspense>
      )
    },
    {
      path: '/admin/contact',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <AdminLayout>
            <Admin />
          </AdminLayout>
        </Suspense>
      )
    },
    {      path: '/admin/booking',      element: (        <Suspense fallback={<LoadingSpinner />}>          <AdminLayout>            <AdminBooking />          </AdminLayout>        </Suspense>      )    },
    {      path: '/admin/add-menu',      element: (        <Suspense fallback={<LoadingSpinner />}>          <AdminLayout>            <AddMenu />          </AdminLayout>        </Suspense>      )    },
    {      path: '/admin/all-menus',      element: (        <Suspense fallback={<LoadingSpinner />}>          <AdminLayout>            <AllMenus />          </AdminLayout>        </Suspense>      )    },
    {      path: '/admin/edit-menu/:id',      element: (        <Suspense fallback={<LoadingSpinner />}>          <AdminLayout>            <EditMenu />          </AdminLayout>        </Suspense>      )    }

  ])

  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  )
}

export default App
