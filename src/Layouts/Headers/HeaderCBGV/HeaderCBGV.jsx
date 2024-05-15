import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MdKeyboardArrowDown } from 'react-icons/md'
// data
import noAvatar from '@/assets/Images/noavatar.png'
import logoUNETI from '@/assets/Images/LOGO_UNETI.ico'
import { useDispatch } from 'react-redux'
import DropdownProfileTeacher from '../DropdownProfileTeacher.jsx'
import { DataCanBoGV } from '@/Services/Utils/dataCanBoGV.js'
import NavbarTTHCGV from '@/Components/Navbars/NavbarTTHCGV.jsx'
import { logOut } from '@/Apis/apiLogout.js'
import { persistor, store } from '@/Services/Redux/store.js'
import MenuMobileTTHCGV from '@/Components/MenuMobiles/MenuMobileTTHCGV.jsx'
import { useNamespace } from '@/Services/Hooks/useNamespace.js'

function HeaderCBGV() {
  const bem = useNamespace('header')

  const dataCBGV = DataCanBoGV()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const state = store.getState()
  const refreshToken = state?.auth?.login?.currentToken?.refreshToken
  const handleLogout = () => {
    localStorage.removeItem('persist:root')
    localStorage.removeItem('currentUrl')
    logOut(dataCBGV.Role, dispatch, navigate, refreshToken)
    persistor.purge()
  }

  return (
    <header
      className={[
        bem.b(),
        ' fixed left-0 right-0 top-0 z-10 w-full border-gray-200 bg-white shadow-md',
      ]}
    >
      <nav className="bg-white border-gray-200">
        <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto relative">
          {/* START: MENU - Mobile */}
          <div className="menu-mobile w-12 h-12 flex justify-center items-center lg:hidden">
            <MenuMobileTTHCGV />
          </div>
          {/* END: MENU - Mobile */}

          {/* STARTL Logo */}
          <Link to="/uneti" className="flex items-center p-2">
            <img src={logoUNETI} className="h-20 mr-3" alt="UNETI Logo" />
          </Link>
          {/* END: Logo */}

          {/* START: USER - Profile */}
          <div
            className="flex items-center md:order-2 relative py-4"
            id="control-dropdown"
          >
            <button
              type="button"
              className="flex items-center gap-4 mr-3 text-sm rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom"
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-14 h-14 rounded-full object-cover border border-slate-500"
                src={noAvatar}
                alt="user photo"
              />
              <span className="hidden md:block">
                {dataCBGV.HoDem + ' ' + dataCBGV.Ten}
              </span>
              <MdKeyboardArrowDown className="text-2xl hidden md:inline-block" />
            </button>
            {/* Dropdown menu */}
            <div
              className={`min-w-[220px] z-50 absolute top-[80%] my-4 right-0 text-base list-none bg-white divide-y divide-gray-100 rounded-b-lg shadow`}
              id="user-dropdown"
            >
              <DropdownProfileTeacher handleLogout={handleLogout} />
            </div>
          </div>
          {/* END: USER - Profile */}

          {/* START: Navbar Pages */}
          {(pathname === '/ho-tro-thiet-bi' ||
            pathname.includes('/ho-tro-thiet-bi/')) && (
            <div className="hidden lg:block col-span-8 lg:col-span-7">
              <p className="w-full text-center text-2xl font-bold uppercase text-uneti-primary">
                Hỗ trợ thiết bị
              </p>
            </div>
          )}
          {pathname.includes('/ho-tro-thiet-bi-giang-duong') && (
            <div className="hidden lg:block col-span-8 lg:col-span-7">
              <p className="w-full text-center text-2xl font-bold uppercase text-uneti-primary">
                Hỗ trợ thiết bị giảng đường
              </p>
            </div>
          )}
          {pathname.includes('/ho-tro-su-dung-phan-mem') && (
            <div className="hidden lg:block col-span-8 lg:col-span-7">
              <p className="w-full text-center text-2xl font-bold uppercase text-uneti-primary">
                Hỗ trợ sử dụng phần mềm
              </p>
            </div>
          )}
          {pathname === '/uneti' && (
            <div className="hidden lg:block col-span-7">
              <div className="py-4 border-b-4 border-sky-600 text-left text-md">
                <p className="w-full text-left text-md lg:text-2xl font-bold uppercase text-uneti-primary">
                  Trường Đại Học Kinh Tế - Kỹ Thuật Công Nghiệp
                </p>
                <p>University of Economics - Technology for Industries</p>
              </div>
              <p className="hidden lg:inline-block uppercase text-md xl:text-3xl font-bold my-2 text-red-600">
                Cổng tổng hợp hỗ trợ tra cứu - dịch vụ công UNETI
              </p>
            </div>
          )}
          {(pathname.includes('/tthc-giang-vien') ||
            pathname.includes('/admin')) && (
            <div className="lg:block col-span-8 lg:col-span-7">
              <div className="flex items-center justify-between">
                <NavbarTTHCGV />
              </div>
            </div>
          )}
          {pathname.includes('/error') && (
            <div className="col-span-8 lg:col-span-7"></div>
          )}
          {/* END: Navbar Pages */}
        </div>
      </nav>
    </header>
  )
}

export default HeaderCBGV
