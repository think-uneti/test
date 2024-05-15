import { useState } from 'react'
import { eef } from 'react'
import { FiTrash } from 'react-icons/fi'
import { BiChevronDown, BiPencil } from 'react-icons/bi'
import { Switch, Tooltip } from '@mui/material'
import { useClickOutside, useNamespace } from '@/Services/Hooks'
import Button from '@/Components/Base/Button/Button'
import { RotateLeft } from '@/Components/Base/Icons/RotateLeft'
import Icon from '@/Components/Base/Icon/Icon'
import { transformCls } from '@/Services/Utils/reactUtils'
import AdvanceSearch from '@/Components/KiemDinhChatLuong/AdvanceSearch'
import { isBoolean } from 'lodash-unified'

const config = [
  {
    ThamSo: 'Mật khẩu mặc định khi tạo người dùng mới',
    GiaTri: '1111',
  },
  {
    ThamSo: 'Thời gian lưu tin nhắn/thông báo trên hệ thống (ngày)',
    GiaTri: 10,
  },
  {
    ThamSo: 'Email host',
    GiaTri: 'smtp.gmail.com',
  },
  {
    ThamSo: 'Email port',
    GiaTri: '857',
  },
  {
    ThamSo: 'Email secure',
    GiaTri: false,
  },
  {
    ThamSo: 'Định dạng file upload',
    GiaTri: 'PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX',
  },
]

export const ThamSoHeThong = () => {
  const ns = useNamespace('kiem-dinh-chat-luong')

  return (
    <div className="box">
      {/* header */}
      <div className={ns.e('header')}>
        <h3 className={ns.em('header', 'title')}>DANH SÁCH CẤU HÌNH</h3>

        <div className={ns.e('actions')}>
          <Tooltip title="Tải lại dữ liệu">
            <button className={ns.em('actions', 'reload')}>
              <Icon>
                <RotateLeft />
              </Icon>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* divider */}
      <div className="uneti-divider" />

      {/* table */}
      <div className={ns.e('main')}>
        <table className="w-full">
          <thead>
            <tr className="tr">
              <th className="th">STT</th>
              <th className="th">Tham số</th>
              <th className="th">Giá trị</th>
              <th className="th">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {config.map((e, i) => (
              <tr key={i} className="tr">
                <td className="td">
                  <div className="text-center">{i + 1}</div>
                </td>
                <td className="td">{e.ThamSo}</td>
                <td className="td">
                  {isBoolean(e.GiaTri) ? (
                    <Switch />
                  ) : (
                    <input
                      className="w-full base-input"
                      value={e.GiaTri}
                      onChange={() => {}}
                    />
                  )}
                </td>
                <td className="td">
                  <div className="flex gap-2 items-center justify-center">
                    <Button icon type="transparent">
                      <Icon>
                        <BiPencil />
                      </Icon>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={8}>
                <div className="py-2">{/* Pagination */}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ThamSoHeThong
