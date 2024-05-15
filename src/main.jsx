import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
import './index.css'
import 'animate.css'
// import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// import { Provider } from 'react-redux'
// import { persistor, store } from './Services/Redux/store.js'
// import { PersistGate } from 'redux-persist/integration/react'

// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/vi'
// import { LocalizationProvider } from '@mui/x-date-pickers'
import { Popper, PopperContent, PopperTrigger } from '@/Components/Base'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <div className="flex items-center justify-center h-screen w-screen">
      <Popper>
        <PopperTrigger>
          <button className="border border-solid border-gray-100 px-2 py-1 rounded-md bg-white">Select me</button>
        </PopperTrigger>

        <PopperContent>This is popper content</PopperContent>
      </Popper>
    </div>
  </>,
  // // <StrictMode>
  // <>
  //   <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
  //     <Provider store={store}>
  //       <PersistGate loading={null} persistor={persistor}>
  //         <App />
  //       </PersistGate>
  //     </Provider>
  //   </LocalizationProvider>
  //   <ToastContainer />
  // </>,
  // // </StrictMode>,
)
