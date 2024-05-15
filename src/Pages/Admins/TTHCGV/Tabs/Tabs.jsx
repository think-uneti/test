import PropTypes from 'prop-types'
import clsx from 'clsx'
import { MdOutlineZoomInMap, MdOutlineZoomOutMap } from 'react-icons/md'

function Tabs(props) {
  const {
    handleOpenTab,
    thongTinActive,
    tpHoSoDeNghiActive,
    trinhTuThucHienActive,
    // phiActive,
    phanQuyenActive,
    // trangThaiActive,
    zoomView,
    setZoomView,
  } = props
  return (
    <div
      className={clsx(
        'mb-5 text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 flex items-center justify-between',
      )}
    >
      <ul className="flex flex-wrap -mb-px">
        <li className="me-2">
          <button
            type="button"
            id="btnThietLapHoSo"
            onClick={handleOpenTab}
            className={clsx(
              'inline-block p-4  border-b-2 rounded-t-lg',
              thongTinActive
                ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
            )}
          >
            Thiết lập hồ sơ
          </button>
        </li>
        <li className="me-2">
          <button
            type="button"
            id="btnTPHSDeNghi"
            onClick={handleOpenTab}
            className={clsx(
              'inline-block p-4 border-b-2 rounded-t-lg',
              tpHoSoDeNghiActive
                ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
            )}
            aria-current="page"
          >
            Thành phần hồ sơ đề nghị
          </button>
        </li>
        <li className="me-2">
          <button
            type="button"
            id="btnTLTrinhTuThucHien"
            onClick={handleOpenTab}
            className={clsx(
              'inline-block p-4 border-b-2',
              trinhTuThucHienActive
                ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
            )}
          >
            Thiết lập trình tự thực hiện
          </button>
        </li>
        {/* <li className="me-2">false);
					<button
						type="button"
						id="btnPhiLePhi"
						onClick={handleOpenTab}
						className={clsx(
							"inline-block p-4 border-b-2",
							phiActive
								? "active text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
								: "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
						)}
					>
						Phí, lệ phí
					</button>
				</li> */}
        <li className="me-2">
          <button
            type="button"
            id="btnPhanQuyen"
            onClick={handleOpenTab}
            className={clsx(
              'inline-block p-4 border-b-2',
              phanQuyenActive
                ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
            )}
          >
            Phân quyền
          </button>
        </li>
        {/* <li className="me-2">
          <button
            type="button"
            id="btnTrangThai"
            onClick={handleOpenTab}
            className={clsx(
              'inline-block p-4 border-b-2',
              trangThaiActive
                ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
            )}
          >
            Trạng thái
          </button>
        </li> */}
      </ul>
      <div className="">
        {zoomView ? (
          <MdOutlineZoomInMap
            size={24}
            className="text-sky-800 cursor-pointer hover:opacity-70"
            onClick={() => {
              setZoomView(false)
            }}
          />
        ) : (
          <MdOutlineZoomOutMap
            size={24}
            className="text-sky-800 cursor-pointer hover:opacity-70"
            onClick={() => {
              setZoomView(true)
            }}
          />
        )}
      </div>
    </div>
  )
}

Tabs.propTypes = {
  handleOpenTab: PropTypes.func.isRequired,
  thongTinActive: PropTypes.bool.isRequired,
  tpHoSoDeNghiActive: PropTypes.bool.isRequired,
  trinhTuThucHienActive: PropTypes.bool.isRequired,
  phiActive: PropTypes.bool.isRequired,
  phanQuyenActive: PropTypes.bool.isRequired,
  trangThaiActive: PropTypes.bool.isRequired,
}

export default Tabs
