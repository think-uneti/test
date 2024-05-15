import { useState } from 'react'
import { eef } from 'react'
import { FiTrash } from 'react-icons/fi'
import { BiChevronDown, BiPencil } from 'react-icons/bi'
import { Tooltip } from '@mui/material'
import { useClickOutside, useNamespace } from '@/Services/Hooks'
import Button from '@/Components/Base/Button/Button'
import { RotateLeft } from '@/Components/Base/Icons/RotateLeft'
import Icon from '@/Components/Base/Icon/Icon'
import { transformCls } from '@/Services/Utils/reactUtils'
import AdvanceSearch from '@/Components/KiemDinhChatLuong/AdvanceSearch'
import CreateForm from '@/Components/KiemDinhChatLuong/QuanTriHeThong/QuanLyDanhMuc/CreateForm'

const cate = [
  {
    Ma: 'Minh chứng',
    Ten: 'Minh chứng',
    MoTa: '',
    TrangThai: 'Sử dụng',
  },
]

export const QuanLyDanhMuc = () => {
  const ns = useNamespace('kiem-dinh-chat-luong')

  return (
    <div className="box">
      {/* header */}
      <div className={ns.e('header')}>
        <h3 className={ns.em('header', 'title')}>
          DANH SÁCH DANH MỤC DÙNG CHUNG
        </h3>

        <div className={ns.e('actions')}>
          <AdvanceSearch />

          <Tooltip title="Tải lại dữ liệu">
            <button className={ns.em('actions', 'reload')}>
              <Icon>
                <RotateLeft />
              </Icon>
            </button>
          </Tooltip>

          <CreateForm />
        </div>
      </div>

      {/* divider */}
      <div className="uneti-divider" />

      {/* table */}
      <div className={ns.e('main')}>
        <div className="mb-2">
          <span>Loại danh mục: </span>
          <select className="base-input w-[200px]">
            <option>Mẫu Email</option>
          </select>
        </div>
        <table className="w-full border">
          <thead>
            <tr className="tr">
              <th className="th">STT</th>
              <th className="th">Mã danh mục</th>
              <th className="th">Tên danh mục</th>
              <th className="th">Mô tả</th>
              <th className="th">Trạng thái</th>
              <th className="th">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {cate.map((e, i) => (
              <tr key={i} className="tr">
                <td className="td">
                  <div className="text-center">{i + 1}</div>
                </td>
                <td className="td">
                  <div className="text-center">{e.Ma}</div>
                </td>
                <td className="td">
                  <div className="text-center">{e.Ten}</div>
                </td>
                <td className="td">
                  <div className="text-center">{e.MoTa}</div>
                </td>
                <td className="td">
                  <div className="text-center">{e.TrangThai}</div>
                </td>
                <td className="td">
                  <div className="flex gap-2 items-center justify-center">
                    <Button icon type="transparent">
                      <Icon>
                        <BiPencil />
                      </Icon>
                    </Button>
                    <Button icon type="flat" color="danger">
                      <Icon>
                        <FiTrash />
                      </Icon>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            <tr className="tr">
              <td colSpan={8} className="td">
                <div className="py-2">Có tổng cộng {cate.length} danh mục</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default QuanLyDanhMuc
