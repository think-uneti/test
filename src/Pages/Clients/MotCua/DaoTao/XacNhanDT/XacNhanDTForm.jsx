import FileSelect from '@/Components/Base/FileSelect/FileSelect'
import { listNoiNhanKetQua } from './constants'
import { listDeNghi } from './constants'
import Button from '@/Components/Base/Button/Button'
import IconTrash from './IconTrash'

export const XacNhanDTForm = (props) => {
  const {
    handleChangeValue,
    handleFilesChange,
    lyDo,
    giayToKemTheo,
    noiNhanKetQua,
    files,
    handleRemoveFile,
  } = props

  return (
    <>
      <div className="w-100 flex flex-col mb-4 md:flex-row justify-start md:justify-between">
        <label
          htmlFor={'MC_DT_XacNhan_YeuCau'}
          className="md:w-[30%] mb-2 md:mb-0"
        >
          Đề nghị xác nhận (*)
        </label>

        <select
          id={'MC_DT_XacNhan_YeuCau'}
          onChange={handleChangeValue}
          className="md:w-[70%] border px-2 py-1 rounded-lg outline-sky-800"
        >
          <option value={''}>Chọn đề nghị</option>
          {listDeNghi?.map((option) => (
            <option value={option.value} key={option.id}>
              {option.title}
            </option>
          ))}
        </select>
      </div>

      <div className="w-100 flex flex-col mb-4 md:flex-row justify-start md:justify-between">
        <label
          htmlFor={'MC_DT_XacNhan_YeuCau_LyDo'}
          className="md:w-[30%] mb-2 md:mb-0"
        >
          Lý do (*)
        </label>

        <textarea
          id="MC_DT_XacNhan_YeuCau_LyDo"
          rows="3"
          value={lyDo}
          placeholder="Nhập lý do tại đây..."
          className="md:w-[70%] border px-2 py-1 rounded-lg outline-sky-800"
          onChange={handleChangeValue}
        />
      </div>

      <div className="w-100 flex flex-col mb-4 md:flex-row justify-start md:justify-between">
        <label
          htmlFor={'MC_DT_XacNhan_YeuCau_KemTheo'}
          className="md:w-[30%] mb-2 md:mb-0"
        >
          Giấy tờ kèm theo
        </label>

        <textarea
          id="MC_DT_XacNhan_YeuCau_KemTheo"
          rows="3"
          value={giayToKemTheo}
          className="md:w-[70%] border px-2 py-1 rounded-lg outline-sky-800"
          onChange={handleChangeValue}
        />
      </div>

      <div className="w-100 flex flex-col mb-4 md:flex-row justify-start md:justify-between">
        <label className="md:w-[30%] mb-2 md:mb-0">Ảnh giấy tờ kèm theo</label>

        {/* Files area */}
        <div className="w-full md:w-[70%] flex flex-wrap items-center gap-2">
          {/* Preview image */}
          {files.map((file, i) => (
            <div key={i}>
              <Button
                onClick={() => handleRemoveFile(file)}
                type="transparent"
                icon={true}
              >
                <div className="scale-75">
                  <IconTrash />
                </div>
              </Button>
              <img
                className="w-32 h-32 rounded-xl object-cover"
                key={file.uniqueIdentifier}
                src={URL.createObjectURL(file)}
              />
            </div>
          ))}

          {files.length < 5 && (
            <FileSelect
              width="128"
              height="128"
              maxFiles={5}
              label="Ấn để chọn ảnh hoặc kéo thả ảnh vào đây"
              handleFilesChange={handleFilesChange}
            />
          )}
        </div>
      </div>

      <div className="w-100 flex flex-col mb-4 md:flex-row justify-start md:justify-between">
        <label
          htmlFor={'MC_DT_XacNhan_NoiNhan'}
          className="md:w-[30%] mb-2 md:mb-0"
        >
          Đăng ký nơi nhận kết quả (*)
        </label>
        <select
          id={'MC_DT_XacNhan_NoiNhan'}
          onChange={handleChangeValue}
          value={noiNhanKetQua}
          className="md:w-[70%] border px-2 py-1 rounded-lg outline-sky-800"
        >
          <option value={''}>Chọn nơi nhận kết quả</option>
          {listNoiNhanKetQua?.map((option) => (
            <option value={option.title} key={option.id}>
              {option.title}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}
