import Button from '@/Components/Base/Button/Button'
import Dialog from '@/Components/Base/Dialog/Dialog'
import Icon from '@/Components/Base/Icon/Icon'
import { Checkbox } from '@mui/material'
import { useRef } from 'react'
import { useState } from 'react'
import { BiPlus } from 'react-icons/bi'

export default function CreateForm(props) {
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef()

  const onCancel = () => {
    dialogRef.current.close()
  }

  const onSave = () => {
    dialogRef.current.close()
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="icon-btn bg-gray-50">
        <Icon>
          <BiPlus />
        </Icon>
      </button>

      <Dialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        ref={dialogRef}
        headerCenter={false}
        headerClass="bg-uneti-primary"
        header={
          <div className="font-semibold ml-7 py-2 text-gray-100 text-lg">
            <h3>Thêm mới sơ đồ tổ chức</h3>
          </div>
        }
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={onCancel} className="base-button bg-gray-500">
              Huỷ
            </button>
            <button onClick={onSave} className="base-button bg-uneti-primary">
              Lưu
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-4 my-2">
          <div className="flex gap-6">
            <span className="inline-block w-[200px]">Đơn vị cấp trên:</span>
            <p className="font-semibold w-full">
              Trường Đại học Kinh tế - Kỹ thuật Công nghiệp
            </p>
          </div>
          <div className="flex gap-6">
            <span className="inline-block w-[200px]">
              Tên đơn vị đầy đủ
              <span className="text-red-500">(*)</span>:
            </span>
            <input className="base-input w-full" />
          </div>
          <div className="flex gap-6">
            <span className="inline-block w-[200px]">Tên đơn vị viết tắt:</span>
            <input className="base-input w-full" />
          </div>
          <div className="flex gap-6">
            <span className="inline-block w-[200px]">
              Phân loại
              <span className="text-red-500">(*)</span>:
            </span>
            <select className="base-input w-full">
              <option>Chọn loại đơn vị</option>
            </select>
          </div>
          <div className="flex gap-6">
            <span className="inline-block w-[200px]">Số thứ tự:</span>
            <input className="base-input w-full" />
          </div>
        </div>
      </Dialog>
    </>
  )
}
