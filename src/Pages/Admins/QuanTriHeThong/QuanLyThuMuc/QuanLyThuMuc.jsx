import Icon from '@/Components/Base/Icon/Icon'
import { RotateLeft } from '@/Components/Base/Icons/RotateLeft'
import { Tooltip } from '@mui/material'
import { useState } from 'react'
import { BiMinus, BiSearch } from 'react-icons/bi'
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'

export const QuanLyThuMuc = () => {
  const [listThuMucGoc, setListThuMucGoc] = useState([
    {
      id: '1',
      text: 'Tin_Nhan_Thong_Bao',
    },
    {
      id: '2',
      text: 'Quy_Trinh',
    },
    {
      id: '3',
      text: 'Minh_Chung_Dung_Chung',
    },
    {
      id: '4',
      text: 'File_Mau',
    },
    {
      id: '5',
      text: 'Tai_Lieu',
    },
    {
      id: '6',
      text: 'Dot_Danh_Gia',
    },
    {
      id: '7',
      text: 'Ke_Hoach_Kiem_Dinh',
    },
    {
      id: '8',
      text: 'Ho_So_Kiem_Dinh',
    },
    {
      id: '9',
      text: 'Gop_Y',
    },
  ])

  const [listChiTietThuTuc, setListChiTietThuTuc] = useState([
    {
      err: true,
      text: '29042018_040435logo_1682023145139.png',
    },
    {
      err: false,
      text: 'logo_2122024173633/png',
    },
    {
      err: true,
      text: 'Lỗi file xuất_2992023143334.xlsx',
    },
    {
      err: true,
      text: 'preview appeal_1682023114156.PNG',
    },
    {
      err: true,
      text: 'quyet-dinh-cong-bo-chuan-dau-ra-ngoai-ngu-1-1-4_48202313514.jpg',
    },
    {
      err: true,
      text: 'quyet-dinh-sua-doi-chuong-trinh-dao-tao-4_4820023141721.jpg',
    },
    {
      err: true,
      text: 'quyet-dinh-thanh-lap-0001_482023141613.jpg',
    },
    {
      err: false,
      text: 'Thông tư 17 (2021)Chuẩn CTĐT_2122024173339.pdf',
    },
  ])

  const [thuMucActive, setThuMucActive] = useState('')

  return (
    <>
      <div className="box">
        {/* header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">QUẢN LÝ THƯ MỤC GỐC</h3>
          </div>
          <div className="flex justify-end items-center gap-[6px]">
            <Tooltip title="Tải lại dữ liệu">
              <button className="w-[37px] aspect-square border-2 rounded-lg flex justify-center items-center bg-slate-200">
                <Icon>
                  <RotateLeft />
                </Icon>
              </button>
            </Tooltip>

            <button className="bg-uneti-primary-lighter text-white px-4 py-2 rounded-md ">
              Tạo thư mục
            </button>
          </div>
        </div>

        {/* divider */}
        <div className="uneti-divider" />

        {/* body */}
        <div className="flex justify-start items-start gap-3 flex-col lg:flex-row">
          {/* thư mục gốc */}
          <div className="flex-1 w-full rounded-lg rounded-t-lg overflow-hidden border-2">
            <div className="flex justify-between items-center text-white bg-uneti-primary px-4 py-2">
              <h4 className=" font-semibold">DANH SÁCH THƯ MỤC GỐC</h4>
              <button className="bg-slate-200 text-vs-text aspect-square w-[32px] rounded-md text-lg border-2 flex justify-center items-center">
                <Icon>
                  <BiMinus />
                </Icon>
              </button>
            </div>
            <div className="m-2 rounded-lg border-2 p-2">
              <div className="relative mb-3">
                <input className="w-full base-input" />

                <button className="flex absolute right-1 top-1/2 -translate-y-1/2">
                  <Icon>
                    <BiSearch />
                  </Icon>
                </button>
              </div>
              <div className="flex justify-start items-start flex-col gap-1 pb-3">
                {listThuMucGoc.length
                  ? listThuMucGoc.map((e, i) => (
                      <div
                        key={i}
                        onClick={() => setThuMucActive(e.id)}
                        className="pl-10 w-full hover:font-semibold cursor-pointer hover:underline py-1 rounded-lg hover:bg-slate-200"
                      >
                        {e.text}
                      </div>
                    ))
                  : null}
              </div>
            </div>
          </div>

          {/* chi tiết */}
          {thuMucActive != '' ? (
            <div className="flex-1 w-full rounded-lg rounded-t-lg overflow-hidden border-2">
              <div className="flex justify-between items-center text-white bg-uneti-primary px-4 py-3">
                <h4 className="font-semibold pt-[1px] text-center w-full">
                  THÔNG TIN CHI TIẾT -{' '}
                  {listThuMucGoc.find((e) => e.id === thuMucActive).text}
                </h4>
              </div>
              <div className="pl-2 py-2 text-base">
                Thư mục:
                <span className="ml-2 font-semibold">
                  {listThuMucGoc.find((e) => e.id === thuMucActive).text}
                </span>
              </div>
              <div className="px-2">
                <div className="flex">
                  <div className="cursor-pointer px-2 pb-3 pt-2 font-semibold text-vs-text hover:text-vs-text hover:bg-slate-200 transition-all duration-200 relative">
                    File vật lý
                    <div className="absolute w-full h-[2px] bg-uneti-primary left-0 top-full"></div>
                  </div>
                  <div className="cursor-pointer px-2 pb-3 pt-2 font-semibold text-slate-400 hover:text-vs-text hover:bg-slate-200 transition-all duration-200 relative">
                    File lưu trong db
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-[2px]"></div>

                <div className="mt-2 p-2">
                  <table className="w-full border-2 border-slate-200">
                    <thead>
                      <tr className="border-b-2 border-slate-200">
                        <th className="bg-uneti-primary text-white p-2 border-r-2 border-slate-200 text-center">
                          STT
                        </th>
                        <th className="bg-uneti-primary text-white p-2 text-center">
                          Tên File
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {listChiTietThuTuc.length
                        ? listChiTietThuTuc.map((e, i) => (
                            <tr
                              key={i}
                              className={`${e.err ? 'text-vs-danger' : ''} border-b-2 border-slate-200`}
                            >
                              <td className="p-2 border-r-2 border-slate-200 text-center">
                                {i + 1}
                              </td>
                              <td className="p-2">{e.text}</td>
                            </tr>
                          ))
                        : null}
                    </tbody>
                  </table>
                  <div className="p-2 flex gap-2">
                    <span className="font-semibold text-slate-400">
                      Có tổng cộng 8 file
                    </span>
                    <div className="flex-1 flex justify-center items-center gap-1">
                      <button className="flex justify-center items-center aspect-square w-[28px] hover:bg-slate-200 rounded-lg text-slate-400 hover:text-vs-text">
                        <Icon>
                          <FaAngleDoubleLeft />
                        </Icon>
                      </button>
                      <button className="flex justify-center items-center aspect-square w-[28px] hover:bg-slate-200 rounded-lg text-slate-400 hover:text-vs-text">
                        <Icon>
                          <FaAngleLeft />
                        </Icon>
                      </button>
                      <span className="flex justify-center items-center aspect-square w-[28px] bg-uneti-primary-lighter bg-opacity-30 rounded-lg text-vs-text">
                        1
                      </span>
                      <button className="flex justify-center items-center aspect-square w-[28px] hover:bg-slate-200 rounded-lg text-slate-400 hover:text-vs-text">
                        <Icon>
                          <FaAngleRight />
                        </Icon>
                      </button>
                      <button className="flex justify-center items-center aspect-square w-[28px] hover:bg-slate-200 rounded-lg text-slate-400 hover:text-vs-text">
                        <Icon>
                          <FaAngleDoubleRight />
                        </Icon>
                      </button>
                      <select className="p-2 rounded-lg border-2" disabled>
                        <option value="10">10</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default QuanLyThuMuc
