import { useWindowSize } from "@uidotdev/usehooks";
import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { GetDataToken } from "./api/Axios/useGetData";
import MainSidebar from "./components/MainSidebar/MainSidebar";
import PageLoader from "./components/PageLoader/PageLoader";
import logoName from './images/logoWithName.png';
import ChangeDirectRoute from "./utils/Protect Routes/ChangeDirectRoute";
import ProtectedRoute from "./utils/Protect Routes/ProtectedRoute";
import notify from "./utils/useToastify";
import HomeLoader from "./components/PageLoader/HomeLoader/HomeLoader";

const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"))
const Patients = lazy(() => import("./pages/Patients/Patients"))
const PatientsDetails = lazy(() => import("./pages/Patients/PatientsDetails"))
const Appointments = lazy(() => import("./pages/Appointments/Appointments"))
const LoginAdmin = lazy(() => import("./pages/Auth/LoginAdmin"))

const App = () => {
  const size = useWindowSize();
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (size.width <= 900) {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }, [size.width])

  const [loading, setLoading] = useState(false)
  const [allUser, setAllUser] = useState([])
  const [allAppointment, setAllAppointment] = useState([])

  const getAllUsers = () => {
    setLoading(false)

    GetDataToken('/api/v1/userInfo').then(res => {
      setLoading(true)
      setAllUser(res.data)
    }).catch(err => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      console.log(err)
      notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
    })
  }

  const getAllAppointment = () => {
    setLoading(false)

    GetDataToken('/api/v1/appointment?sort=date').then(res => {
      setLoading(true)
      setAllAppointment(res.data)
    }).catch(err => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      console.log(err)
      notify(err.response.data.msg || err.response.data.message || err.response.data.errors[0].msg, 'error')
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      await getAllUsers()
      await getAllAppointment()
    };
    localStorage.getItem('user') !== null && fetchData()
  }, [])

  const [isAdmin, isLogged] = ProtectedRoute();

  return (
    <div className="p-3" id={isActive || localStorage.getItem('user') === null ? 'collaps-menu' : ''}>
      <BrowserRouter>
        <PageLoader dataLoading={loading} />
        {
          localStorage.getItem('user') !== null && <MainSidebar isActive={isActive} setIsActive={setIsActive} />
        }
        <img src={logoName} alt="logo" className="fixed-image" />
        <div className="pages">
          <Suspense fallback={<div className='page-loader'>
            <HomeLoader />
          </div>}>
            <Routes>
              <Route element={<ChangeDirectRoute auth={isAdmin} type='admin' />}>
                <Route path="/" element={<Dashboard getAllAppointment={getAllAppointment} allUser={allUser} allAppointment={allAppointment} loading={loading} />} />
                <Route path="/appointments" element={<Appointments getAllAppointment={getAllAppointment} allUser={allUser} allAppointment={allAppointment} loading={loading} />} />
                <Route path="/patients" element={<Patients getAllUsers={getAllUsers} allUser={allUser} loading={loading} />} />
                <Route path="/patientsDetails/:id" element={<PatientsDetails allAppointment={allAppointment} />} />
              </Route>

              <Route element={<ChangeDirectRoute auth={isLogged} type='login' />}>
                <Route path="/login" element={<LoginAdmin />} />
              </Route>
            </Routes>
          </Suspense>
        </div>
        <ToastContainer
          position="bottom-right"
          theme="colored"
        />
      </BrowserRouter>
    </div>
  )
}

export default App