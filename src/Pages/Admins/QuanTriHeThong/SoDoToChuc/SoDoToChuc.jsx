import { FiTrash } from 'react-icons/fi'
import { BiChevronDown, BiPencil, BiPlus } from 'react-icons/bi'
import { Switch, Tooltip } from '@mui/material'
import { useClickOutside, useNamespace } from '@/Services/Hooks'
import Button from '@/Components/Base/Button/Button'
import { RotateLeft } from '@/Components/Base/Icons/RotateLeft'
import Icon from '@/Components/Base/Icon/Icon'
import { transformCls } from '@/Services/Utils/reactUtils'
import AdvanceSearch from '@/Components/KiemDinhChatLuong/AdvanceSearch'
import { isBoolean } from 'lodash-unified'
import { BsPencil } from 'react-icons/bs'
import CreateForm from '@/Components/KiemDinhChatLuong/QuanTriHeThong/SoDoToChuc/CreateForm'

export const SoDoToChuc = () => {
  const ns = useNamespace('kiem-dinh-chat-luong')

  return (
    <>
      <div className="box">
        {/* header */}
        <div className={ns.e('header')}>
          <h3 className={ns.em('header', 'title')}>sơ đồ tổ chức đơn vị</h3>

          <div className={ns.e('actions')}>
            <Tooltip title="Tải lại dữ liệu">
              <button className="icon-btn bg-gray-50">
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
                <th className="th">Tên đầy đủ</th>
                <th className="th">Tên viết tắt</th>
                <th className="th">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              <tr className="tr">
                <td className="td" colSpan={3}>
                  <div className="flex items-center">
                    <Icon>
                      <BiChevronDown />
                    </Icon>
                    Sơ đồ tổ chức
                  </div>
                </td>
              </tr>
              <tr className="tr">
                <td className="td">
                  <div className="flex items-center ml-5">
                    <Icon>
                      <BiChevronDown />
                    </Icon>
                    Trường Đại học Kinh tế - Kỹ thuật Công nghiệp
                  </div>
                </td>
                <td className="td">
                  <div>UNETI</div>
                </td>
                <td className="td">
                  <div className="flex items-center justify-center gap-2">
                    <CreateForm />
                    <button className="icon-btn bg-gray-50">
                      <Icon>
                        <BsPencil />
                      </Icon>
                    </button>
                    <button className="icon-btn bg-gray-50">
                      <Icon>
                        <FiTrash />
                      </Icon>
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="tr">
                <td className="td">
                  <div className="flex items-center ml-10">Khoa thương mại</div>
                </td>
                <td className="td">
                  <div></div>
                </td>
                <td className="td">
                  <div className="flex items-center justify-center gap-2">
                    <button className="icon-btn bg-gray-50">
                      <Icon>
                        <BsPencil />
                      </Icon>
                    </button>
                    <button className="icon-btn bg-gray-50">
                      <Icon>
                        <FiTrash />
                      </Icon>
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="tr">
                <td className="td">
                  <div className="flex items-center ml-10">
                    Khoa Tài Chính - Kế Toán
                  </div>
                </td>
                <td className="td">
                  <div></div>
                </td>
                <td className="td">
                  <div className="flex items-center justify-center gap-2">
                    <button className="icon-btn bg-gray-50">
                      <Icon>
                        <BsPencil />
                      </Icon>
                    </button>
                    <button className="icon-btn bg-gray-50">
                      <Icon>
                        <FiTrash />
                      </Icon>
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="tr">
                <td className="td">
                  <div className="flex items-center ml-10">Khoa Cơ khí</div>
                </td>
                <td className="td">
                  <div></div>
                </td>
                <td className="td">
                  <div className="flex items-center justify-center gap-2">
                    <button className="icon-btn bg-gray-50">
                      <Icon>
                        <BsPencil />
                      </Icon>
                    </button>
                    <button className="icon-btn bg-gray-50">
                      <Icon>
                        <FiTrash />
                      </Icon>
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={3}>
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

export default SoDoToChuc
