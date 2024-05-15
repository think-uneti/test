import { FiTrash } from 'react-icons/fi'
import { BiChevronDown, BiPencil, BiPlus } from 'react-icons/bi'
import { Checkbox, Switch, Tooltip } from '@mui/material'
import { useClickOutside, useNamespace } from '@/Services/Hooks'
import Button from '@/Components/Base/Button/Button'
import { RotateLeft } from '@/Components/Base/Icons/RotateLeft'
import Icon from '@/Components/Base/Icon/Icon'
import { transformCls } from '@/Services/Utils/reactUtils'
import AdvanceSearch from '@/Components/KiemDinhChatLuong/AdvanceSearch'
import { isBoolean } from 'lodash-unified'
import { BsPencil } from 'react-icons/bs'

export const MauKhaoSat = () => {
  const ns = useNamespace('kiem-dinh-chat-luong')

  return (
    <>
      <div className="box">
        {/* header */}
        <div className={ns.e('header')}>
          <h3 className={ns.em('header', 'title')}>mẫu khảo sát</h3>
        </div>

        {/* divider */}
        <div className="uneti-divider" />

        {/* table */}
        <div className={ns.e('main')}>
          <div className="mb-2 flex justify-between items-center">
            <div className="flex items-center">
              <span>Mẫu khảo sát:</span>
              <select className="base-input w-[200px] ml-2">
                <option>Ý kiến giảng viên</option>
              </select>
            </div>
            <div className="flex items-center">
              <span>Trạng thái</span>
              <Checkbox />
              sử dụng
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="tr">
                <th className="th">Bảng/Phần/Mục</th>
                <th className="th">Nội dung đánh giá</th>
              </tr>
            </thead>

            <tbody>
              <tr className="tr">
                <td className="td">
                  <div className="flex items-center">
                    <Icon>
                      <BiChevronDown />
                    </Icon>
                    1
                  </div>
                </td>
                <td className="td">Giảng viên tự đánh giá</td>
              </tr>
              <tr className="tr">
                <td className="td">
                  <div className="flex items-center ml-10">1</div>
                </td>
                <td className="td">
                  <div>Chất lượng cơ sở vật chất</div>
                </td>
              </tr>
              <tr className="tr">
                <td className="td">
                  <div className="flex items-center ml-10">2</div>
                </td>
                <td className="td">
                  <div>Nguồn học liệu cho sinh viên trong các môn học</div>
                </td>
              </tr>
              <tr className="tr">
                <td colSpan={2} className="td">
                  <div className="py-2">{/* Pagination */}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default MauKhaoSat
