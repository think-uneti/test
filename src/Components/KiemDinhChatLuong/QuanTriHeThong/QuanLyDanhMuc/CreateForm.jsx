import Button from '@/Components/Base/Button/Button'
import Dialog from '@/Components/Base/Dialog/Dialog'
import { Checkbox } from '@mui/material'
import { useRef } from 'react'
import { useState } from 'react'

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
      <button
        onClick={() => setIsOpen(true)}
        className="base-button bg-uneti-primary-lighter"
      >
        Thêm mới
      </button>

      <Dialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        ref={dialogRef}
        headerCenter={false}
        headerClass="bg-uneti-primary"
        header={
          <div className="font-semibold ml-7 py-2 text-gray-100 text-lg">
            <h3>Thêm mới danh mục</h3>
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
            <span className="inline-block w-[200px]">
              Mã danh mục <span className="text-red-500">(*)</span>:
            </span>
            <input className="base-input w-full" placeholder="Nhập nội dung" />
          </div>
          <div className="flex gap-6">
            <span className="inline-block w-[200px]">
              Tên danh mục <span className="text-red-500">(*)</span>:
            </span>
            <input className="base-input w-full" placeholder="Nhập nội dung" />
          </div>
          <div className="flex gap-6">
            <span className="inline-block w-[200px]">Mô tả:</span>
            <textarea
              className="base-input w-full"
              placeholder="Nhập nội dung"
            />
          </div>

          <div className="flex gap-6">
            <span className="inline-block w-[200px]">
              Sử dụng <span className="text-red-500">(*)</span>:
            </span>
            <div className="-ml-4 w-full">
              <Checkbox id="btc-check-id" />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}
