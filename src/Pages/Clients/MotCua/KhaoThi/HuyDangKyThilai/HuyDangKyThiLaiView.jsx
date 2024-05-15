import Breadcrumb from '@/Components/Breadcumb/Breadcrumb'
import Loading from '@/Components/Loading/Loading'
import { Checkbox, TextareaAutosize } from '@mui/material'
import { isEqual } from 'lodash-unified'

function HuyDangKyThiLaiView(props) {
  const {
    loading,
    home,
    breadcrumbs,
    tenDot,
    setTenDot,
    loaiThi,
    setLoaiThi,
    lyDo,
    setLyDo,
    lyDoKhac,
    setLyDoKhac,
    listHocKy,
    listLyDo,
    listHocPhan,
    handleRowSelection,
    handleSubmitData,
    selectedRow,
  } = props

  return (
    <div className="bg-white shadow-module-item rounded-md">
      <div className="p-4 flex flex-col gap-4">
        <Breadcrumb home={home} breadcrumbs={breadcrumbs} />
        <div className="mt-5 rounded-md">
          <form className="md:py-8 flex flex-col justify-center items-center gap-4">
            <h2 className="text-center uppercase text-xl md:text-2xl font-medium text-sky-800 mb-6">
              TIẾP NHẬN YÊU CẦU ĐĂNG KÝ HỦY THI LẠI
            </h2>
            <div className="w-[90%] md:w-[75%] flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <span className="block pr-10">Học kỳ (*)</span>
              <select
                value={tenDot}
                onChange={(e) => setTenDot(e.target.value)}
                className="flex-1 md:max-w-[75%] px-2 py-1 rounded-md border border-solid border-gray-300"
              >
                <option value="">Chọn học kỳ</option>
                {listHocKy.map((e, index) => (
                  <option key={index} value={e.TenDot}>
                    {e.TenDot}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-[90%] md:w-[75%] flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <span className="block pr-10">Loại thi</span>
              <select
                disabled
                defaultValue="Thi Lại"
                className="flex-1 md:max-w-[75%] px-2 py-1 rounded-md border border-solid border-gray-300"
              >
                <option value="Thi Lại">Thi Lại</option>
              </select>
            </div>
            <div className="w-[90%] md:w-[75%] flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <span className="block pr-10">Lý do (*)</span>
              <select
                value={lyDo}
                onChange={(e) => {
                  setLyDo(e.target.value)
                  setLyDoKhac('')
                }}
                className="flex-1 md:max-w-[75%] px-2 py-1 rounded-md border border-solid border-gray-300"
              >
                {listLyDo.map((e, index) => (
                  <option key={index} value={e.value}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>
            {lyDo === '3' && (
              <div className="w-[75%] flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                <span className="block pr-10">Lý do khác (*)</span>
                <TextareaAutosize
                  className="flex-1 md:max-w-[75%] p-2 rounded-md border border-solid border-gray-300"
                  value={lyDoKhac}
                  onChange={(e) => setLyDoKhac(e.target.value)}
                  minRows="3"
                />
              </div>
            )}
          </form>

          {(tenDot === '' && lyDo != '') || (tenDot != '' && lyDo === '') ? (
            <div className="flex justify-center items-center pb-4">
              <span className="w-[75%] mt-4 text-center font-medium block text-red-900 bg-red-200 p-3 rounded-md">
                Vui lòng chọn học kỳ để xem lịch thi cần đăng ký!
              </span>
            </div>
          ) : null}

          {loading ? (
            <div className="w-full flex justify-center">
              <Loading />
            </div>
          ) : (
            tenDot !== '' &&
            lyDo !== '' && (
              <div className="flex flex-col justify-center items-center pb-4">
                <div className="w-full md:w-[75%] overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr>
                        <th className="p-2 text-xs md:text-base font-medium bg-[#245D7C] text-white border border-solid border-[#dee2e6]">
                          STT
                        </th>
                        <th className="p-2 text-xs md:text-base font-medium bg-[#245D7C] text-white border border-solid border-[#dee2e6]">
                          CHỌN
                        </th>
                        <th className="p-2 text-xs md:text-base font-medium bg-[#245D7C] text-white border border-solid border-[#dee2e6]">
                          MÃ LỚP HỌC PHẦN
                        </th>
                        <th className="p-2 text-xs md:text-base font-medium bg-[#245D7C] text-white border border-solid border-[#dee2e6]">
                          TÊN MÔN HỌC
                        </th>
                        <th className="p-2 text-xs md:text-base font-medium bg-[#245D7C] text-white border border-solid border-[#dee2e6]">
                          HÌNH THỨC THI
                        </th>
                        <th className="p-2 text-xs md:text-base font-medium bg-[#245D7C] text-white border border-solid border-[#dee2e6]">
                          ĐIỂM TB THƯỜNG KỲ
                        </th>
                        <th className="p-2 text-xs md:text-base font-medium bg-[#245D7C] text-white border border-solid border-[#dee2e6]">
                          ĐIỂM THI
                        </th>
                        <th className="p-2 text-xs md:text-base font-medium bg-[#245D7C] text-white border border-solid border-[#dee2e6]">
                          ĐIỂM TỔNG KẾT
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {listHocPhan.length ? (
                        listHocPhan.map((hocphan, index) => (
                          <tr key={index}>
                            <td className="text-center p-3 border border-solid border-[#dee2e6]">
                              {index + 1}
                            </td>
                            <td className="text-center p-3 border border-solid border-[#dee2e6]">
                              <Checkbox
                                checked={isEqual(selectedRow, hocphan)}
                                onChange={() => {
                                  handleRowSelection(hocphan)
                                }}
                              />
                            </td>
                            <td className="text-center p-3 border border-solid border-[#dee2e6]">
                              {hocphan.MaLopHocPhan}
                            </td>
                            <td className="text-center p-3 border border-solid border-[#dee2e6]">
                              {hocphan.TenMonHoc}
                            </td>
                            <td className="text-center p-3 border border-solid border-[#dee2e6]">
                              {hocphan.TenHinhThucThi}
                            </td>
                            <td className="text-center p-3 border border-solid border-[#dee2e6]">
                              {hocphan.DiemTBThuongKy}
                            </td>
                            <td className="text-center p-3 border border-solid border-[#dee2e6]">
                              {hocphan.DiemThi}
                            </td>
                            <td className="text-center p-3 border border-solid border-[#dee2e6]">
                              {hocphan.DiemTongKet}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="8"
                            className="text-center p-3 border border-solid border-[#dee2e6]"
                          >
                            Hiện tại chưa có dữ liệu học phần cho học kỳ này!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={handleSubmitData}
                  className="mt-8 px-5 py-3 border-2 border-solid text-[#245D7C] border-[#245D7C] rounded-md font-medium transition-all duration-200 hover:bg-[#245D7C] hover:text-white"
                >
                  Gửi Yêu Cầu
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default HuyDangKyThiLaiView
