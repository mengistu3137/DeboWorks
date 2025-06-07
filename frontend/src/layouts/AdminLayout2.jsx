import AdminMenu from "./../components/admin/AdminMenu"
import AdminNavbar from "./../components/admin/AdminNavBar"
import Footer from "./../components/Footer"
import { Outlet } from 'react-router-dom'


const AdiminLayout2 = () => {
  return (
      <div className="adminLayout text-white   max-h-screen overflow-hidden ">
          <AdminNavbar />
          <div className="adminLayoutContainer top-15  sticky z-[10]  ">
              <div className="menuContainer top-15 sticky w-64 overflow-y-auto  ">
                  <AdminMenu/>
              </div>
              <div></div>
              <div className="contentContainer overflow-y-auto z-[-10] max-h-screen">
                  <Outlet />
              </div>
          </div>
          {/* <Footer /> */}
      </div>
  )
}

export default AdiminLayout2