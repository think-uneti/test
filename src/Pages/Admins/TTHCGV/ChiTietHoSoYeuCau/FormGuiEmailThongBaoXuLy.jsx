// import PropTypes from 'prop-types'
import { convertDataFileToBase64 } from '@/Services/Utils/stringUtils'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { DebounceInput } from 'react-debounce-input'
import Swal from 'sweetalert2'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import Select from 'react-select'

import { FaTrash } from 'react-icons/fa6'
import { NguonTiepNhan_WEB } from '@/Services/Static/dataStatic'
import {
  TEMPLATE_SUBJECT_CANCEL_EMAIL,
  TEMPLATE_SUBJECT_PENDING_EMAIL,
  TEMPLATE_SUBJECT_RECEIVED_EMAIL,
  sendEmailTTHCGV_BGH_TP,
  sendEmailTTHCGV_CBNV_TP,
  sendEmailTTHCGV_MucDo2,
  sendEmailTTHCGV_TP_BGH,
  sendEmailTTHCGV_TP_CBNV,
  sendEmailTTHCGiangVien,
} from '@/Services/Utils/emailUtils'
import { DataCanBoGV } from '@/Services/Utils/dataCanBoGV'
import { putHoSoThuTucGuiYeuCauById } from '@/Apis/ThuTucHanhChinhGiangVien/apiThuTucHanhChinhGiangVien'
import { getTrangThaiIDBySTTYeuCauId } from '@/Apis/ThuTucHanhChinhGiangVien/apiTrangThai'
import {
  MC_TTHC_GV_DoiTuongXuLy_PheDuyet,
  listYeuCauPheDuyet,
} from '../constants'
import dayjs from 'dayjs'
import { compareDateTime } from '@/Services/Utils/dateTimeUtils'
import { ROLE_VIEW_ACTION_TTHCGV } from '@/Routers/privateRoutes'
import { TextEditor } from '@/Components/TextEditor/TextEditor'

const optionSendEmail = [
  { value: 1, label: 'Người nộp hồ sơ' },
  { value: 2, label: 'Cán bộ xử lý' },
  { value: 3, label: 'Trưởng/Phó đơn vị' },
  { value: 4, label: 'Ban giám hiệu' },
]

const FormGuiEmailThongBaoXuLy = (props) => {
  const {
    infoStatus,
    dataDetailYeuCau,
    dataDetailTPHSYeuCau,
    currentStatusId,
    currentStep,
    stepHandle,
    listStatus,
    mucDoId,
    contentEmail,
    onContentEmail,
    linkAttachedFile,
    dataAttachedFile,
    onLinkAttachedFile,
    onAttachedFile,
    listDataCBNVPhanQuyen,
    onLoading,
    isDTPheDuyet,
  } = props

  const dataCBGV = DataCanBoGV()
  const [isTPPheDuyet, setIsTPPheDuyet] = useState(null)
  const [contentTPPheDuyet, setContentTPPheDuyet] = useState('')
  const [isBGHPheDuyet, setIsBGHPheDuyet] = useState(null)
  const [contentBGHPheDuyet, setContentBGHPheDuyet] = useState('')
  const [checkListPheDuyet, setCheckListPheDuyet] = useState(null)
  const [timeWork, setTimeWork] = useState(null)
  const [errorTimeWork, setErrorTimeWork] = useState(null)

  const [isSendEmail, setIsSendEmail] = useState(true)
  const [isSendEmailNguoiDung, setSendEmailNguoiDung] = useState(true)
  const [isSendEmailCBNV, setSendEmailCBNV] = useState(true)
  const [isSendEmailTruongPhong, setSendEmailTruongPhong] = useState(true)
  const [isSendEmailBGH, setSendEmailBGH] = useState(true)

  const [locationWork, setLocationWork] = useState('')

  // Event handlers
  // Tiếp nhận hồ sơ
  const handleTiepNhanHoSo = () => {
    if (
      !isDTPheDuyet &&
      (dataCBGV.HT_GROUPUSER_ID.includes(ROLE_VIEW_ACTION_TTHCGV.TP_TTHCGV) ===
        true ||
        dataCBGV.HT_GROUPUSER_ID.includes(
          ROLE_VIEW_ACTION_TTHCGV.BGH_TTHCGV,
        ) === true)
    ) {
      return Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Thầy/Cô không có quyền xử lý bước này!',
      })
    }

    let newDataUpdate
    //   Xét hồ sơ đã xử lý xong || đã hủy trả
    if (
      dataDetailYeuCau.MC_TTHC_GV_TrangThai_STT ===
      dataDetailYeuCau.MC_TTHC_GV_TrangThai_STTMAX
    ) {
      return Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Yêu cầu này đã được xử lý xong!',
      })
    }

    if (dataDetailYeuCau.MC_TTHC_GV_TrangThai_STT < 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Yêu cầu này đã được hủy/trả!',
      })
    }

    if (timeWork === null && mucDoId === 2) {
      return Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Vui lòng chọn thời gian tiếp nhận hồ sơ!',
      })
    }

    if (errorTimeWork !== null) {
      return Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Thời gian hẹn nhận hồ sơ chưa hợp lệ!',
      })
    }

    if (locationWork.trim() === '' && mucDoId === 2) {
      return Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Vui lòng nhập địa điểm tiếp nhận hồ sơ!',
      })
    }

    if (contentEmail.trim() === '' || !contentEmail) {
      return Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Vui lòng nhập nội dung thông báo!',
      })
    }

    if (currentStatusId === 0) {
      Swal.fire({
        icon: 'question',
        title: 'Thầy/cô chắc chắn muốn tiếp nhận hồ sơ này?',
        html: `
            <ul style='display: flex; flex-direction: column; align-items: flex-start'>
                ${contentEmail.trim() === '' ? '<li>- Nội dung thông báo email không có.</li>' : ''}
                ${linkAttachedFile.trim() === '' ? '<li>- Link tệp đính kèm không có.</li>' : ''}
                ${dataAttachedFile.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() === '' ? '<li>- Tệp đính kèm không có.</li>' : ''}
            </ul>
            <b style='color: red'>${contentEmail.trim() === '' || linkAttachedFile.trim() === '' || dataAttachedFile.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() === '' ? 'Vẫn thực hiện mà không cần đầy đủ thông tin trên?' : ''}</b>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Đồng ý',
        showCancelButton: true,
        cancelButtonText: 'Hủy',
      }).then(async (result) => {
        if (result.isConfirmed) {
          const resNewTrangThaiID = await getTrangThaiIDBySTTYeuCauId(
            dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_YeuCau_ID,
            1,
          )
          if (resNewTrangThaiID.status === 200) {
            const dataTrangThaiIDNew = await resNewTrangThaiID.data?.body[0]

            newDataUpdate = {
              MC_TTHC_GV_GuiYeuCau_ID: dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_ID,
              MC_TTHC_GV_GuiYeuCau_NhanSuGui_MaNhanSu:
                dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NhanSuGui_MaNhanSu,
              MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email:
                dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email,
              MC_TTHC_GV_GuiYeuCau_NhanSuGui_SDT:
                dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NhanSuGui_SDT,
              MC_TTHC_GV_GuiYeuCau_NhanSuGui_Khoa:
                dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Khoa,
              MC_TTHC_GV_GuiYeuCau_YeuCau_ID:
                dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_YeuCau_ID,
              MC_TTHC_GV_GuiYeuCau_YeuCau_GhiChu:
                dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_YeuCau_GhiChu,
              MC_TTHC_GV_GuiYeuCau_TrangThai_ID:
                dataTrangThaiIDNew?.MC_TTHC_GV_TrangThai_ID,
              MC_TTHC_GV_GuiYeuCau_TrangThai_GhiChu:
                dataTrangThaiIDNew?.MC_TTHC_GV_TrangThai_TenTrangThai,
              MC_TTHC_GV_GuiYeuCau_NgayGui:
                dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NgayGui,
              MC_TTHC_GV_GuiYeuCau_KetQua_SoLuong:
                dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_KetQua_SoLuong,
              MC_TTHC_GV_GuiYeuCau_DaNop:
                dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_DaNop,
              MC_TTHC_GV_GuiYeuCau_NgayHenTra:
                dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NgayHenTra,
              MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile: '',
              MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile: null,
              MC_TTHC_GV_GuiYeuCau_TrangThaiPheDuyetTruongPhong: null,
              MC_TTHC_GV_GuiYeuCau_MoTaTTPheDuyetTruongPhong: '',
              MC_TTHC_GV_GuiYeuCau_TrangThaiPheDuyetBGH: null,
              MC_TTHC_GV_GuiYeuCau_MoTaTTPheDuyetBGH: '',
              MC_TTHC_GV_GuiYeuCau_NgayGiaoTra:
                dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NgayGiaoTra,
              MC_TTHC_GV_GuiYeuCau_NoiTraKetQua:
                dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NoiTraKetQua,
              MC_TTHC_GV_GuiYeuCau_NoiDung_XuLy: contentEmail,
              MC_TTHC_GV_GuiYeuCau_NguonTiepNhan: NguonTiepNhan_WEB,
            }
          }

          const resPutHoSoThuTuc =
            await putHoSoThuTucGuiYeuCauById(newDataUpdate)
          if (resPutHoSoThuTuc.status === 200) {
            Swal.fire({
              title: 'Thông báo',
              text: 'Đã tiếp nhận hồ sơ! Tiếp tục xử lý yêu cầu!',
              icon: 'success',
            })

            if (mucDoId === 2) {
              sendEmailTTHCGV_MucDo2(
                infoStatus.MC_TTHC_GV_TrangThai_TenTrangThai,
                {
                  ...dataDetailYeuCau,
                  ...newDataUpdate,
                },
                dataCBGV,
                contentEmail,
                dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email,
                timeWork,
                locationWork,
                linkAttachedFile,
                dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() !==
                  ''
                  ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim()
                  : null,
                dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                  ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                  : null,
                dataDetailTPHSYeuCau,
              ).then(() => console.log('SEND EMAIL TIẾP NHẬN HSMD2 OK'))
            } else {
              sendEmailTTHCGiangVien(
                TEMPLATE_SUBJECT_RECEIVED_EMAIL,
                'tiếp nhận',
                { ...dataDetailYeuCau, ...newDataUpdate },
                dataCBGV,
                dataDetailTPHSYeuCau,
                contentEmail,
                linkAttachedFile,
                dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() !==
                  ''
                  ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim()
                  : null,
                dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                  ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                  : null,
              ).then(() => console.log('SEND EMAIL OK'))
            }

            onLoading(true)
            onContentEmail('')
            setContentBGHPheDuyet('')
            setContentTPPheDuyet('')
            setTimeWork(null)
            setIsTPPheDuyet(null)
            setIsBGHPheDuyet(null)
            setErrorTimeWork(null)
            setIsSendEmail(null)
            onLinkAttachedFile('')
            onAttachedFile({
              MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile: '',
              MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile: '',
            })
          } else {
            return Swal.fire({
              icon: 'error',
              title:
                'Không tìm thấy trạng thái được thiết lập cho hồ sơ này để tiến hành cập nhật!',
            })
          }
        } else {
          Swal.fire('Đã dừng việc tiếp nhận hồ sơ', '', 'info')
        }
      })
    } else {
      return Swal.fire({
        icon: 'error',
        title: 'Hồ sơ đã được tiếp nhận!',
        text: 'Vui lòng thao tác xử lý tại các bước tiếp theo!',
      })
    }
  }

  // Gửi thông báo xử lý yêu cầu
  const handleThongBaoXuLyHoSo = async () => {
    let dataYeuCauTTHCGV = {
      MC_TTHC_GV_GuiYeuCau_ID: dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_ID,
      MC_TTHC_GV_GuiYeuCau_NhanSuGui_MaNhanSu:
        dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NhanSuGui_MaNhanSu,
      MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email:
        dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email,
      MC_TTHC_GV_GuiYeuCau_NhanSuGui_SDT:
        dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NhanSuGui_SDT,
      MC_TTHC_GV_GuiYeuCau_NhanSuGui_Khoa:
        dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Khoa,
      MC_TTHC_GV_GuiYeuCau_YeuCau_ID:
        dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_YeuCau_ID,
      MC_TTHC_GV_GuiYeuCau_YeuCau_GhiChu:
        dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_YeuCau_GhiChu,
      MC_TTHC_GV_GuiYeuCau_TrangThai_ID: null,
      MC_TTHC_GV_GuiYeuCau_TrangThai_GhiChu: '',
      MC_TTHC_GV_GuiYeuCau_NgayGui:
        dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NgayGui,
      MC_TTHC_GV_GuiYeuCau_KetQua_SoLuong:
        dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_KetQua_SoLuong,
      MC_TTHC_GV_GuiYeuCau_DaNop: dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_DaNop,
      MC_TTHC_GV_GuiYeuCau_NgayHenTra:
        dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NgayHenTra,
      MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile:
        dataAttachedFile.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile
          ? dataAttachedFile.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile
          : linkAttachedFile
            ? linkAttachedFile
            : '',
      MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile:
        dataAttachedFile.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
          ? dataAttachedFile.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
          : linkAttachedFile
            ? linkAttachedFile
            : '',
      MC_TTHC_GV_GuiYeuCau_TrangThaiPheDuyetTruongPhong: null,
      MC_TTHC_GV_GuiYeuCau_MoTaTTPheDuyetTruongPhong: '',
      MC_TTHC_GV_GuiYeuCau_TrangThaiPheDuyetBGH: null,
      MC_TTHC_GV_GuiYeuCau_MoTaTTPheDuyetBGH: '',
      MC_TTHC_GV_GuiYeuCau_NgayGiaoTra:
        dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NgayGiaoTra,
      MC_TTHC_GV_GuiYeuCau_NoiTraKetQua:
        dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NoiTraKetQua,
      MC_TTHC_GV_GuiYeuCau_NguonTiepNhan: NguonTiepNhan_WEB,
    }
    //   Xét hồ sơ đã xử lý xong || đã hủy trả
    if (
      dataDetailYeuCau.MC_TTHC_GV_TrangThai_STT ===
      dataDetailYeuCau.MC_TTHC_GV_TrangThai_STTMAX
    ) {
      return Swal.fire({
        icon: 'info',
        title: 'Yêu cầu này đã được xử lý xong!',
      })
    }

    if (dataDetailYeuCau.MC_TTHC_GV_TrangThai_STT < 0) {
      return Swal.fire({
        icon: 'info',
        title: 'Yêu cầu này đã được hủy/trả!',
      })
    }

    if (contentEmail.trim() === '' || !contentEmail) {
      return Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Vui lòng nhập nội dung gửi thông báo!',
      })
    }
    //   END: Validate

    if (currentStatusId !== 0) {
      // TH1: Trạng thái không có đối tượng phê duyệt
      if (
        !infoStatus.MC_TTHC_GV_TrangThai_DoiTuongXuLy ||
        infoStatus.MC_TTHC_GV_TrangThai_DoiTuongXuLy === 0
      ) {
        if (
          !isDTPheDuyet &&
          (dataCBGV.HT_GROUPUSER_ID.includes(
            ROLE_VIEW_ACTION_TTHCGV.TP_TTHCGV,
          ) === true ||
            dataCBGV.HT_GROUPUSER_ID.includes(
              ROLE_VIEW_ACTION_TTHCGV.BGH_TTHCGV,
            ) === true)
        ) {
          return Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Thầy/Cô không có quyền xử lý bước này!',
          })
        }

        Swal.fire({
          icon: 'question',
          title: 'Xác nhận hoàn thành bước này và chuyển tới bước tiếp theo?',
          html: `
                <ul style='display: flex; flex-direction: column; align-items: flex-start'>
                    ${contentEmail.trim() === '' ? '<li>- Nội dung thông báo email không có.</li>' : ''}
                    ${linkAttachedFile.trim() === '' ? '<li>- Link tệp đính kèm không có.</li>' : ''}
                    ${dataAttachedFile.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() === '' ? '<li>- Tệp đính kèm không có.</li>' : ''}
                </ul>
                <b style='color: red'>${contentEmail.trim() === '' || linkAttachedFile.trim() === '' || dataAttachedFile.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() === '' ? 'Vẫn thực hiện mà không cần đầy đủ thông tin trên?' : ''}</b>
            `,
          showConfirmButton: true,
          confirmButtonText: 'Đồng ý',
          showCancelButton: true,
          cancelButtonText: 'Hủy',
        }).then(async (result) => {
          if (result.isConfirmed) {
            const resNewTrangThaiID = await getTrangThaiIDBySTTYeuCauId(
              dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_YeuCau_ID,
              dataDetailYeuCau.MC_TTHC_GV_TrangThai_STT + 1,
            )

            if (resNewTrangThaiID.status === 200) {
              const dataTrangThaiIDNew = await resNewTrangThaiID.data?.body[0]

              const newDataTiepNhanUpdate = {
                ...dataYeuCauTTHCGV,
                MC_TTHC_GV_GuiYeuCau_TrangThai_ID:
                  dataTrangThaiIDNew?.MC_TTHC_GV_TrangThai_ID,
                MC_TTHC_GV_GuiYeuCau_TrangThai_GhiChu:
                  dataTrangThaiIDNew?.MC_TTHC_GV_TrangThai_TenTrangThai,
                MC_TTHC_GV_GuiYeuCau_NoiDung_XuLy: contentEmail,
              }

              const resPutHoSoThuTuc = await putHoSoThuTucGuiYeuCauById(
                newDataTiepNhanUpdate,
              )
              if (resPutHoSoThuTuc.status === 200) {
                Swal.fire({
                  title: 'Thông báo',
                  text: `Đã tiếp hoàn thành bước ${infoStatus.MC_TTHC_GV_TrangThai_TenTrangThai} sơ! Tiếp tục xử lý yêu cầu!`,
                  icon: 'success',
                })

                if (isSendEmailNguoiDung === true) {
                  if (mucDoId === 2) {
                    sendEmailTTHCGV_MucDo2(
                      infoStatus.MC_TTHC_GV_TrangThai_TenTrangThai,
                      {
                        ...dataDetailYeuCau,
                        ...newDataTiepNhanUpdate,
                      },
                      dataCBGV,
                      contentEmail,
                      dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email,
                      timeWork,
                      locationWork,
                      linkAttachedFile,
                      dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() !==
                        ''
                        ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim()
                        : null,
                      dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                        ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                        : null,
                      dataDetailTPHSYeuCau,
                    ).then(() => console.log('SEND EMAIL XỬ LÝ HSMD2 OK'))
                  } else {
                    // Gửi EMAIL cho người đề nghị
                    sendEmailTTHCGiangVien(
                      TEMPLATE_SUBJECT_PENDING_EMAIL,
                      infoStatus.MC_TTHC_GV_TrangThai_TenTrangThai,
                      { ...dataDetailYeuCau, ...newDataTiepNhanUpdate },
                      dataCBGV,
                      dataDetailTPHSYeuCau,
                      contentEmail,
                      linkAttachedFile,
                      dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() !==
                        ''
                        ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim()
                        : null,
                      dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                        ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                        : null,
                    ).then(() => console.log('SEND EMAIL OK'))
                  }
                }

                //   GỬI EMAIL CHO TRƯỞNG PHÒNG
                if (
                  dataDetailYeuCau?.MC_TTHC_GV_IsTruongPhongPheDuyet === true &&
                  isSendEmailTruongPhong === true
                ) {
                  sendEmailTTHCGV_CBNV_TP(
                    infoStatus.MC_TTHC_GV_TrangThai_TenTrangThai,
                    {
                      ...dataDetailYeuCau,
                      ...newDataTiepNhanUpdate,
                    },
                    dataCBGV,
                    dataDetailTPHSYeuCau,
                    contentEmail,
                    linkAttachedFile,
                    dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() !==
                      ''
                      ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim()
                      : null,
                    dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                      ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                      : null,
                    dataDetailYeuCau.MC_TTHC_GV_EmailTruongPhongPheDuyet,
                  ).then(() => console.log('SEND EMAIL OK'))
                }

                onLoading(true)
                onContentEmail('')
                setContentBGHPheDuyet('')
                setContentTPPheDuyet('')
                setTimeWork(null)
                setIsTPPheDuyet(null)
                setIsBGHPheDuyet(null)
                setErrorTimeWork(null)
                setIsSendEmail(null)
                onLinkAttachedFile('')
                onAttachedFile({
                  MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile: '',
                  MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile: '',
                })
              } else {
                return Swal.fire({
                  icon: 'error',
                  title:
                    'Không tìm thấy trạng thái được thiết lập cho hồ sơ này để tiến hành cập nhật!',
                })
              }
            }
          } else {
            Swal.fire('Đã dừng việc xác nhận hồ sơ', '', 'info')
          }
        })
      } else if (
        infoStatus.MC_TTHC_GV_TrangThai_DoiTuongXuLy ===
        parseInt(MC_TTHC_GV_DoiTuongXuLy_PheDuyet[0].id)
      ) {
        //   TH2: Trạng thái có đối tượng phê duyệt là Trưởng phòng
        if (dataCBGV.HT_GROUPUSER_ID?.includes('24') === false) {
          return Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Bạn không có quyền được xử lý bước này.',
          })
        }
        if (isTPPheDuyet === null) {
          return Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Vui lòng chọn hình thức phê duyệt!',
          })
        }
        if (+isTPPheDuyet === 0) {
          //   TH2.1: TP Phê duyệt
          const resNewTrangThaiID = await getTrangThaiIDBySTTYeuCauId(
            dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_YeuCau_ID,
            parseInt(dataDetailYeuCau.MC_TTHC_GV_TrangThai_STT) + 1,
          )
          if (resNewTrangThaiID.status === 200) {
            const dataTrangThaiIDNew = await resNewTrangThaiID.data?.body[0]

            const newDataTPPheDuyetUpdate = {
              ...dataYeuCauTTHCGV,
              MC_TTHC_GV_GuiYeuCau_TrangThai_ID:
                dataTrangThaiIDNew?.MC_TTHC_GV_TrangThai_ID,
              MC_TTHC_GV_GuiYeuCau_TrangThai_GhiChu:
                dataTrangThaiIDNew?.MC_TTHC_GV_TrangThai_TenTrangThai,
              MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile:
                dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile,
              MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile:
                dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile,
              MC_TTHC_GV_GuiYeuCau_TrangThaiPheDuyetTruongPhong: isTPPheDuyet,
              MC_TTHC_GV_GuiYeuCau_MoTaTTPheDuyetTruongPhong: contentTPPheDuyet,
              MC_TTHC_GV_GuiYeuCau_NoiDung_XuLy: contentEmail,
            }

            Swal.fire({
              icon: 'question',
              title:
                'Xác nhận phê duyệt bước này và chuyển tới bước tiếp theo?',
              html: `
                    <ul style='display: flex; flex-direction: column; align-items: flex-start'>
                        ${contentEmail.trim() === '' ? '<li>- Nội dung thông báo email không có.</li>' : ''}
                        ${linkAttachedFile.trim() === '' ? '<li>- Link tệp đính kèm không có.</li>' : ''}
                        ${dataAttachedFile.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() === '' ? '<li>- Tệp đính kèm không có.</li>' : ''}
                    </ul>
                    <b style='color: red'>${contentEmail.trim() === '' || linkAttachedFile.trim() === '' || dataAttachedFile.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() === '' ? 'Vẫn thực hiện mà không cần đầy đủ thông tin trên?' : ''}</b>
                `,
              showConfirmButton: true,
              confirmButtonText: 'Đồng ý',
              showCancelButton: true,
              cancelButtonText: 'Hủy',
            }).then(async (result) => {
              if (result.isConfirmed) {
                let hasSendEmailErr = false

                const resPutHoSoThuTuc = await putHoSoThuTucGuiYeuCauById(
                  newDataTPPheDuyetUpdate,
                )
                if (resPutHoSoThuTuc.status === 200) {
                  Swal.fire({
                    title: 'Thông báo',
                    text: `Đã phê duyệt bước ${infoStatus.MC_TTHC_GV_TrangThai_TenTrangThai}! Tiếp tục xử lý yêu cầu!`,
                    icon: 'success',
                  })
                  if (isSendEmailCBNV === true) {
                    try {
                      const listSendEmailCBNV = listDataCBNVPhanQuyen?.map(
                        async (cbnv) => {
                          return await sendEmailTTHCGV_TP_CBNV(
                            listYeuCauPheDuyet[0].label,
                            {
                              ...dataDetailYeuCau,
                              ...newDataTPPheDuyetUpdate,
                            },
                            dataCBGV,
                            dataDetailTPHSYeuCau,
                            contentEmail,
                            linkAttachedFile,
                            dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() !==
                              ''
                              ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim()
                              : null,
                            dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                              ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                              : null,
                            cbnv?.QTPM_QLEMAIL_EmailUneti,
                          ).then(() => console.log('SEND EMAIL OK'))
                        },
                      )
                    } catch (error) {
                      console.error('Error send email CBNV:', error.message)
                    }
                  }

                  onLoading(true)
                  onContentEmail('')
                  setContentBGHPheDuyet('')
                  setContentTPPheDuyet('')
                  setTimeWork(null)
                  setIsTPPheDuyet(null)
                  setIsBGHPheDuyet(null)
                  setErrorTimeWork(null)
                  setIsSendEmail(null)
                  onLinkAttachedFile('')
                  onAttachedFile({
                    MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile: '',
                    MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile: '',
                  })
                } else {
                  return Swal.fire({
                    icon: 'error',
                    title:
                      'Không tìm thấy trạng thái được thiết lập cho hồ sơ này để tiến hành cập nhật!',
                  })
                }
              } else {
                Swal.fire('Đã dừng việc phê duyệt hồ sơ', '', 'info')
              }
            })
          }
        } else if (+isTPPheDuyet === 1) {
          //   TH2.2: TP Không phê duyệt
          const resNewTrangThaiID = await getTrangThaiIDBySTTYeuCauId(
            dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_YeuCau_ID,
            dataDetailYeuCau.MC_TTHC_GV_TrangThai_STT - 1,
          )
          if (resNewTrangThaiID.status === 200) {
            const dataTrangThaiIDNew = await resNewTrangThaiID.data?.body[0]
            const newDataTPKhongPheDuyetUpdate = {
              ...dataYeuCauTTHCGV,
              MC_TTHC_GV_GuiYeuCau_TrangThai_ID:
                dataTrangThaiIDNew?.MC_TTHC_GV_TrangThai_ID,
              MC_TTHC_GV_GuiYeuCau_TrangThai_GhiChu:
                dataTrangThaiIDNew?.MC_TTHC_GV_TrangThai_TenTrangThai,
              MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile:
                dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile,
              MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile:
                dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile,
              MC_TTHC_GV_GuiYeuCau_TrangThaiPheDuyetTruongPhong: isTPPheDuyet,
              MC_TTHC_GV_GuiYeuCau_MoTaTTPheDuyetTruongPhong: contentTPPheDuyet,
              MC_TTHC_GV_GuiYeuCau_NoiDung_XuLy: contentEmail,
            }
            Swal.fire({
              icon: 'question',
              title:
                'Xác nhận không phê duyệt hồ sơ và quay lại bước trước đấy?',
              html: `
                    <ul style='display: flex; flex-direction: column; align-items: flex-start'>
                        ${contentEmail.trim() === '' ? '<li>- Nội dung thông báo email không có.</li>' : ''}
                        ${linkAttachedFile.trim() === '' ? '<li>- Link tệp đính kèm không có.</li>' : ''}
                        ${dataAttachedFile.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() === '' ? '<li>- Tệp đính kèm không có.</li>' : ''}
                    </ul>
                    <b style='color: red'>${contentEmail.trim() === '' || linkAttachedFile.trim() === '' || (dataAttachedFile.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() === '' && 'Vãn thực hiện mà không cần đầy đủ thông tin trên?')}</b>
                `,
              showConfirmButton: true,
              confirmButtonText: 'Đồng ý',
              showCancelButton: true,
              cancelButtonText: 'Hủy',
            }).then(async (result) => {
              if (result.isConfirmed) {
                const resPutHoSoThuTuc = await putHoSoThuTucGuiYeuCauById(
                  newDataTPKhongPheDuyetUpdate,
                )
                if (resPutHoSoThuTuc.status === 200) {
                  Swal.fire({
                    title: 'Thông báo',
                    text: `Đã không phê duyệt hồ sơ và quay về bước trước! Tiếp tục xử lý yêu cầu!`,
                    icon: 'success',
                  })

                  // GỬI THÔNG BÁO EMAIL KHÔNG PHÊ DUYỆT CHO CBNV XỬ LÝ HỒ SƠ
                  if (isSendEmailCBNV === true) {
                    try {
                      const listSendEmailCBNV = listDataCBNVPhanQuyen.map(
                        async (cbnv) => {
                          return await sendEmailTTHCGV_TP_CBNV(
                            listYeuCauPheDuyet[0].label,
                            {
                              ...dataDetailYeuCau,
                              ...newDataTPKhongPheDuyetUpdate,
                            },
                            dataCBGV,
                            dataDetailTPHSYeuCau,
                            contentEmail,
                            linkAttachedFile,
                            dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() !==
                              ''
                              ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim()
                              : null,
                            dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                              ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                              : null,
                            cbnv?.QTPM_QLEMAIL_EmailUneti,
                          ).then(() => console.log('SEND EMAIL OK'))
                        },
                      )
                    } catch (error) {
                      console.error('Error send email CBNV:', error.message)
                    }
                  }

                  onLoading(true)
                  onContentEmail('')
                  setContentBGHPheDuyet('')
                  setContentTPPheDuyet('')
                  setTimeWork(null)
                  setIsTPPheDuyet(null)
                  setIsBGHPheDuyet(null)
                  setErrorTimeWork(null)
                  setIsSendEmail(null)
                  onLinkAttachedFile('')
                  onAttachedFile({
                    MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile: '',
                    MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile: '',
                  })
                } else {
                  return Swal.fire({
                    icon: 'error',
                    title:
                      'Không tìm thấy trạng thái được thiết lập cho hồ sơ này để tiến hành cập nhật!',
                  })
                }
              } else {
                Swal.fire('Đã dừng việc không phê duyệt hồ sơ', '', 'info')
              }
            })
          }
        } else if (+isTPPheDuyet === 2) {
          //   TH2.3: TP Trình duyệt
          const resNewTrangThaiID = await getTrangThaiIDBySTTYeuCauId(
            dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_YeuCau_ID,
            dataDetailYeuCau.MC_TTHC_GV_TrangThai_STT + 1,
          )

          if (resNewTrangThaiID.status === 200) {
            const dataTrangThaiIDNew = await resNewTrangThaiID.data?.body[0]
            const newDataTPTrinhDuyetUpdate = {
              ...dataYeuCauTTHCGV,
              MC_TTHC_GV_GuiYeuCau_TrangThai_ID:
                dataTrangThaiIDNew?.MC_TTHC_GV_TrangThai_ID,
              MC_TTHC_GV_GuiYeuCau_TrangThai_GhiChu:
                dataTrangThaiIDNew?.MC_TTHC_GV_TrangThai_TenTrangThai,
              MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile:
                dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile,
              MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile:
                dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile,
              MC_TTHC_GV_GuiYeuCau_TrangThaiPheDuyetTruongPhong: isTPPheDuyet,
              MC_TTHC_GV_GuiYeuCau_MoTaTTPheDuyetTruongPhong: contentTPPheDuyet,
              MC_TTHC_GV_GuiYeuCau_NoiDung_XuLy: contentEmail,
            }
            Swal.fire({
              icon: 'question',
              title:
                'Xác nhận trình duyệt bước này và chuyển đến bước tiếp theo?',
              html: `
                    <ul style='display: flex; flex-direction: column; align-items: flex-start'>
                        ${contentEmail.trim() === '' ? '<li>- Nội dung thông báo email không có.</li>' : ''}
                        ${linkAttachedFile.trim() === '' ? '<li>- Link tệp đính kèm không có.</li>' : ''}
                        ${dataAttachedFile.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() === '' ? '<li>- Tệp đính kèm không có.</li>' : ''}
                    </ul>
                    <b style='color: red'>${contentEmail.trim() === '' || linkAttachedFile.trim() === '' || dataAttachedFile.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() === '' ? 'Vẫn thực hiện mà không cần đầy đủ thông tin trên?' : ''}</b>
                `,
              showConfirmButton: true,
              confirmButtonText: 'Đồng ý',
              showCancelButton: true,
              cancelButtonText: 'Hủy',
            }).then(async (result) => {
              if (result.isConfirmed) {
                const resPutHoSoThuTuc = await putHoSoThuTucGuiYeuCauById(
                  newDataTPTrinhDuyetUpdate,
                )
                if (resPutHoSoThuTuc.status === 200) {
                  Swal.fire({
                    title: 'Thông báo',
                    text: `Hồ sơ đã trình duyệt!`,
                    icon: 'success',
                  })
                  // GỬI THÔNG BÁO EMAIL TRÌNH DUYỆT CHO CBNV XỬ LÝ HỒ SƠ
                  if (isSendEmailCBNV == true) {
                    try {
                      const listSendEmailCBNV = listDataCBNVPhanQuyen.map(
                        async (cbnv) => {
                          return await sendEmailTTHCGV_TP_CBNV(
                            listYeuCauPheDuyet[2].label,
                            {
                              ...dataDetailYeuCau,
                              ...newDataTPTrinhDuyetUpdate,
                            },
                            dataCBGV,
                            dataDetailTPHSYeuCau,
                            contentEmail,
                            linkAttachedFile,
                            dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() !==
                              ''
                              ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim()
                              : null,
                            dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                              ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                              : null,
                            cbnv?.QTPM_QLEMAIL_EmailUneti,
                          ).then(() => console.log('SEND EMAIL OK'))
                        },
                      )
                    } catch (error) {
                      console.error('Error send email CBNV:', error.message)
                    }
                  }

                  // GỬI THÔNG BÁO EMAIL TRÌNH DUYỆT TỚI BGH
                  sendEmailTTHCGV_TP_BGH(
                    'Trình duyệt',
                    {
                      ...dataDetailYeuCau,
                      ...newDataTPTrinhDuyetUpdate,
                    },
                    dataCBGV,
                    dataDetailTPHSYeuCau,
                    contentEmail,
                    linkAttachedFile,
                    dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() !==
                      ''
                      ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim()
                      : null,
                    dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                      ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                      : null,
                    dataDetailYeuCau?.MC_TTHC_GV_EmailBGHPheDuyet,
                  )
                  onLoading(true)
                  onContentEmail('')
                  setContentBGHPheDuyet('')
                  setContentTPPheDuyet('')
                  setTimeWork(null)
                  setIsTPPheDuyet(null)
                  setIsBGHPheDuyet(null)
                  setErrorTimeWork(null)
                  setIsSendEmail(null)
                  onLinkAttachedFile('')
                  onAttachedFile({
                    MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile: '',
                    MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile: '',
                  })
                } else {
                  return Swal.fire({
                    icon: 'error',
                    title:
                      'Không tìm thấy trạng thái được thiết lập cho hồ sơ này để tiến hành cập nhật!',
                  })
                }
              } else {
                Swal.fire('Đã dừng việc trình duyệt hồ sơ', '', 'info')
              }
            })
          }
        }
      } else if (
        infoStatus.MC_TTHC_GV_TrangThai_DoiTuongXuLy ===
        parseInt(MC_TTHC_GV_DoiTuongXuLy_PheDuyet[1].id)
      ) {
        //   TH3: Trạng thái có đối tượng phê duyệt là BGH
        if (dataCBGV.HT_GROUPUSER_ID?.includes('25') === false) {
          return Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Bạn không có quyền được xử lý bước này.',
          })
        }

        if (isBGHPheDuyet === null) {
          return Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Vui lòng chọn hình thức phê duyệt!',
          })
        }

        if (+isBGHPheDuyet === 0) {
          //   TH3.1: BGH Phê duyệt
          const resNewTrangThaiID = await getTrangThaiIDBySTTYeuCauId(
            dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_YeuCau_ID,
            parseInt(dataDetailYeuCau.MC_TTHC_GV_TrangThai_STT) + 1,
          )
          if (resNewTrangThaiID.status === 200) {
            const dataTrangThaiIDNew = await resNewTrangThaiID.data?.body[0]

            const newDataBGHPheDuyetUpdate = {
              ...dataYeuCauTTHCGV,
              MC_TTHC_GV_GuiYeuCau_TrangThai_ID:
                dataTrangThaiIDNew?.MC_TTHC_GV_TrangThai_ID,
              MC_TTHC_GV_GuiYeuCau_TrangThai_GhiChu:
                dataTrangThaiIDNew?.MC_TTHC_GV_TrangThai_TenTrangThai,
              MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile:
                dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile,
              MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile:
                dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile,
              MC_TTHC_GV_GuiYeuCau_TrangThaiPheDuyetTruongPhong: isTPPheDuyet,
              MC_TTHC_GV_GuiYeuCau_MoTaTTPheDuyetTruongPhong: contentTPPheDuyet,
              MC_TTHC_GV_GuiYeuCau_TrangThaiPheDuyetBGH: isBGHPheDuyet,
              MC_TTHC_GV_GuiYeuCau_MoTaTTPheDuyetBGH: contentBGHPheDuyet,
              MC_TTHC_GV_GuiYeuCau_NoiDung_XuLy: contentEmail,
            }

            Swal.fire({
              icon: 'question',
              title:
                'Xác nhận phê duyệt bước này và chuyển tới bước tiếp theo?',
              html: `
                    <ul style='display: flex; flex-direction: column; align-items: flex-start'>
                        ${contentEmail.trim() === '' ? '<li>- Nội dung thông báo email không có.</li>' : ''}
                        ${linkAttachedFile.trim() === '' ? '<li>- Link tệp đính kèm không có.</li>' : ''}
                        ${dataAttachedFile.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() === '' ? '<li>- Tệp đính kèm không có.</li>' : ''}
                    </ul>
                    <b style='color: red'>${contentEmail.trim() === '' || linkAttachedFile.trim() === '' || dataAttachedFile.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() === '' ? 'Vẫn thực hiện mà không cần đầy đủ thông tin trên?' : ''}</b>
                `,
              showConfirmButton: true,
              confirmButtonText: 'Đồng ý',
              showCancelButton: true,
              cancelButtonText: 'Hủy',
            }).then(async (result) => {
              if (result.isConfirmed) {
                const resPutHoSoThuTuc = await putHoSoThuTucGuiYeuCauById(
                  newDataBGHPheDuyetUpdate,
                )
                if (resPutHoSoThuTuc.status === 200) {
                  Swal.fire({
                    title: 'Thông báo',
                    text: `Đã phê duyệt bước ${infoStatus.MC_TTHC_GV_TrangThai_TenTrangThai}! Tiếp tục xử lý yêu cầu!`,
                    icon: 'success',
                  })

                  // BGH GỬI EMAIL THÔNG BÁO PHÊ DUYỆT CHO CÁN BỘ NGHIỆP VỤ
                  if (isSendEmailCBNV === true) {
                    try {
                      const listSendEmailCBNV = listDataCBNVPhanQuyen.map(
                        async (cbnv) => {
                          return await sendEmailTTHCGV_TP_CBNV(
                            listYeuCauPheDuyet[0].label,
                            {
                              ...dataDetailYeuCau,
                              ...newDataBGHPheDuyetUpdate,
                            },
                            dataCBGV,
                            dataDetailTPHSYeuCau,
                            contentEmail,
                            linkAttachedFile,
                            dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() !==
                              ''
                              ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim()
                              : null,
                            dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                              ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                              : null,
                            cbnv?.QTPM_QLEMAIL_EmailUneti,
                          ).then(() => console.log('SEND EMAIL OK'))
                        },
                      )
                    } catch (error) {
                      console.error('Error send email CBNV:', error.message)
                    }
                  }

                  //   GỬI EMAIL THÔNG BÁO CHO TRƯỞNG/PHÓ PHÒNG
                  if (isSendEmailTruongPhong === true) {
                    sendEmailTTHCGV_BGH_TP(
                      listYeuCauPheDuyet[0].label,
                      {
                        ...dataDetailYeuCau,
                        ...newDataBGHPheDuyetUpdate,
                      },
                      dataCBGV,
                      dataDetailTPHSYeuCau,
                      contentEmail,
                      linkAttachedFile,
                      dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() !==
                        ''
                        ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim()
                        : null,
                      dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                        ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                        : null,
                      dataDetailYeuCau.MC_TTHC_GV_EmailTruongPhongPheDuyet,
                    ).then(() => console.log('SEND EMAIL OK'))
                  }
                  onLoading(true)
                  onContentEmail('')
                  setContentBGHPheDuyet('')
                  setContentTPPheDuyet('')
                  setTimeWork(null)
                  setIsTPPheDuyet(null)
                  setIsBGHPheDuyet(null)
                  setErrorTimeWork(null)
                  setIsSendEmail(null)
                  onLinkAttachedFile('')
                  onAttachedFile({
                    MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile: '',
                    MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile: '',
                  })
                } else {
                  return Swal.fire({
                    icon: 'error',
                    title:
                      'Không tìm thấy trạng thái được thiết lập cho hồ sơ này để tiến hành cập nhật!',
                  })
                }
              } else {
                Swal.fire('Đã dừng việc phê duyệt hồ sơ', '', 'info')
              }
            })
          }
        } else if (+isBGHPheDuyet === 1) {
          //   TH3.2: BGH Không phê duyệt
          const resNewTrangThaiID = await getTrangThaiIDBySTTYeuCauId(
            dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_YeuCau_ID,
            dataDetailYeuCau.MC_TTHC_GV_TrangThai_STT - 1,
          )
          if (resNewTrangThaiID.status === 200) {
            const dataTrangThaiIDNew = await resNewTrangThaiID.data?.body[0]
            const newDataBGHKhongPheDuyetUpdate = {
              ...dataYeuCauTTHCGV,
              MC_TTHC_GV_GuiYeuCau_TrangThai_ID:
                dataTrangThaiIDNew?.MC_TTHC_GV_TrangThai_ID,
              MC_TTHC_GV_GuiYeuCau_TrangThai_GhiChu:
                dataTrangThaiIDNew?.MC_TTHC_GV_TrangThai_TenTrangThai,
              MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile:
                dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile,
              MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile:
                dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile,
              MC_TTHC_GV_GuiYeuCau_TrangThaiPheDuyetTruongPhong: isTPPheDuyet,
              MC_TTHC_GV_GuiYeuCau_MoTaTTPheDuyetTruongPhong: contentTPPheDuyet,
              MC_TTHC_GV_GuiYeuCau_TrangThaiPheDuyetBGH: isBGHPheDuyet,
              MC_TTHC_GV_GuiYeuCau_MoTaTTPheDuyetBGH: contentBGHPheDuyet,
              MC_TTHC_GV_GuiYeuCau_NoiDung_XuLy: contentEmail,
            }
            Swal.fire({
              icon: 'question',
              title:
                'Xác nhận không phê duyệt hồ sơ và quay lại bước trước đấy?',
              html: `
                    <ul style='display: flex; flex-direction: column; align-items: flex-start'>
                        ${contentEmail.trim() === '' ? '<li>- Nội dung thông báo email không có.</li>' : ''}
                        ${linkAttachedFile.trim() === '' ? '<li>- Link tệp đính kèm không có.</li>' : ''}
                        ${dataAttachedFile.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() === '' ? '<li>- Tệp đính kèm không có.</li>' : ''}
                    </ul>
                    <b style='color: red'>${contentEmail.trim() === '' || linkAttachedFile.trim() === '' || dataAttachedFile.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() === '' ? 'Vẫn thực hiện mà không cần đầy đủ thông tin trên?' : ''}</b>
                `,
              showConfirmButton: true,
              confirmButtonText: 'Đồng ý',
              showCancelButton: true,
              cancelButtonText: 'Hủy',
            }).then(async (result) => {
              if (result.isConfirmed) {
                const resPutHoSoThuTuc = await putHoSoThuTucGuiYeuCauById(
                  newDataBGHKhongPheDuyetUpdate,
                )
                if (resPutHoSoThuTuc.status === 200) {
                  Swal.fire({
                    title: 'Thông báo',
                    text: `Đã không phê duyệt hồ sơ và quay về bước trước! Tiếp tục xử lý yêu cầu!`,
                    icon: 'success',
                  })

                  // BGH GỬI EMAIL THÔNG BÁO KHÔNG PHÊ DUYỆT CHO CBNV
                  if (isSendEmailCBNV === true) {
                    try {
                      const listSendEmailCBNV = listDataCBNVPhanQuyen.map(
                        async (cbnv) => {
                          return await sendEmailTTHCGiangVien(
                            listYeuCauPheDuyet[0].label,
                            {
                              ...dataDetailYeuCau,
                              ...newDataBGHKhongPheDuyetUpdate,
                            },
                            dataCBGV,
                            dataDetailTPHSYeuCau,
                            contentEmail,
                            linkAttachedFile,
                            dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() !==
                              ''
                              ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim()
                              : null,
                            dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                              ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                              : null,
                            cbnv?.QTPM_QLEMAIL_EmailUneti,
                          ).then(() => console.log('BGH SEND EMAIL TO CBNV OK'))
                        },
                      )
                    } catch (error) {
                      console.error('Error send email CBNV:', error.message)
                    }
                  }
                  // BGH GỬI EMAIL THÔNG BÁO KHÔNG PHÊ DUYỆT CHO TRƯỞNG/PHÓ PHÒNG
                  if (isSendEmailTruongPhong === true) {
                    sendEmailTTHCGV_BGH_TP(
                      listYeuCauPheDuyet[1].label,
                      {
                        ...dataDetailYeuCau,
                        ...newDataBGHKhongPheDuyetUpdate,
                      },
                      dataCBGV,
                      dataDetailTPHSYeuCau,
                      contentEmail,
                      linkAttachedFile,
                      dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() !==
                        ''
                        ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim()
                        : null,
                      dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                        ? dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile
                        : null,
                      dataDetailYeuCau.MC_TTHC_GV_EmailTruongPhongPheDuyet,
                    ).then(() => console.log('BGH SEND EMAIL TO TPDV OK'))
                  }

                  onLoading(true)
                  onContentEmail('')
                  setContentBGHPheDuyet('')
                  setContentTPPheDuyet('')
                  setTimeWork(null)
                  setIsTPPheDuyet(null)
                  setIsBGHPheDuyet(null)
                  setErrorTimeWork(null)
                  onLinkAttachedFile('')
                  onAttachedFile({
                    MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile: '',
                    MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile: '',
                  })
                } else {
                  return Swal.fire({
                    icon: 'error',
                    title:
                      'Không tìm thấy trạng thái được thiết lập cho hồ sơ này để tiến hành cập nhật!',
                  })
                }
              } else {
                Swal.fire('Đã dừng việc không phê duyệt hồ sơ', '', 'info')
              }
            })
          }
        }
      }
    } else {
      return Swal.fire({
        icon: 'error',
        title: 'Hồ sơ chưa được tiếp nhận!',
        text: 'Vui lòng tiếp nhận hồ sơ và thực hiện xử lý tuần tự theo các bước!',
      })
    }
  }

  // Hủy trả hồ sơ
  const handleCancelHoSo = () => {
    if (
      !isDTPheDuyet &&
      (dataCBGV.HT_GROUPUSER_ID.includes(ROLE_VIEW_ACTION_TTHCGV.TP_TTHCGV) ===
        true ||
        dataCBGV.HT_GROUPUSER_ID.includes(
          ROLE_VIEW_ACTION_TTHCGV.BGH_TTHCGV,
        ) === true)
    ) {
      return Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Thầy/Cô không có quyền xử lý bước này!',
      })
    }
    if (!isSendEmail) {
      return Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Vui lòng chọn hình thức thông báo!',
      })
    }

    setErrorTimeWork(null)
    let newDataUpdate
    if (currentStatusId !== -1) {
      Swal.fire({
        icon: 'question',
        title: 'Bạn chắc chắn muốn hủy trả hồ sơ này?',
        html: `
            <ul style='display: flex; flex-direction: column; align-items: flex-start'>
                ${contentEmail.trim() === '' ? '<li>- Nội dung thông báo email không có.</li>' : ''}
                ${linkAttachedFile.trim() === '' ? '<li>- Link tệp đính kèm không có.</li>' : ''}
                ${dataAttachedFile.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() === '' ? '<li>- Tệp đính kèm không có.</li>' : ''}
            </ul>
            <b style='color: red'>${contentEmail.trim() === '' || linkAttachedFile.trim() === '' || dataAttachedFile.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() === '' ? 'Vẫn thực hiện mà không cần đầy đủ thông tin trên?' : ''}</b>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Đồng ý',
        showCancelButton: true,
        cancelButtonText: 'Hủy',
      }).then(async (result) => {
        if (result.isConfirmed) {
          newDataUpdate = {
            MC_TTHC_GV_GuiYeuCau_ID: dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_ID,
            MC_TTHC_GV_GuiYeuCau_NhanSuGui_MaNhanSu:
              dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NhanSuGui_MaNhanSu,
            MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email:
              dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email,
            MC_TTHC_GV_GuiYeuCau_NhanSuGui_SDT:
              dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NhanSuGui_SDT,
            MC_TTHC_GV_GuiYeuCau_NhanSuGui_Khoa:
              dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Khoa,
            MC_TTHC_GV_GuiYeuCau_YeuCau_ID:
              dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_YeuCau_ID,
            MC_TTHC_GV_GuiYeuCau_YeuCau_GhiChu:
              dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_YeuCau_GhiChu,
            MC_TTHC_GV_GuiYeuCau_TrangThai_ID: -1,
            MC_TTHC_GV_GuiYeuCau_TrangThai_GhiChu: 'Hủy trả hồ sơ',
            MC_TTHC_GV_GuiYeuCau_NgayGui:
              dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NgayGui,
            MC_TTHC_GV_GuiYeuCau_KetQua_SoLuong:
              dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_KetQua_SoLuong,
            MC_TTHC_GV_GuiYeuCau_DaNop:
              dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_DaNop,
            MC_TTHC_GV_GuiYeuCau_NgayHenTra:
              dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NgayHenTra,
            MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile: '',
            MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile: null,
            MC_TTHC_GV_GuiYeuCau_TrangThaiPheDuyetTruongPhong: null,
            MC_TTHC_GV_GuiYeuCau_MoTaTTPheDuyetTruongPhong: '',
            MC_TTHC_GV_GuiYeuCau_TrangThaiPheDuyetBGH: null,
            MC_TTHC_GV_GuiYeuCau_MoTaTTPheDuyetBGH: '',
            MC_TTHC_GV_GuiYeuCau_NgayGiaoTra:
              dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NgayGiaoTra,
            MC_TTHC_GV_GuiYeuCau_NoiTraKetQua:
              dataDetailYeuCau.MC_TTHC_GV_GuiYeuCau_NoiTraKetQua,
            MC_TTHC_GV_GuiYeuCau_NoiDung_XuLy: contentEmail,
            MC_TTHC_GV_GuiYeuCau_NguonTiepNhan: NguonTiepNhan_WEB,
          }

          if (contentEmail.trim() === '' || !contentEmail) {
            return Swal.fire({
              icon: 'error',
              title: 'Lỗi',
              text: 'Vui lòng nhập nội dung gửi thông báo!',
            })
          }

          const resPutHoSoThuTuc =
            await putHoSoThuTucGuiYeuCauById(newDataUpdate)
          if (resPutHoSoThuTuc.status === 200) {
            Swal.fire({
              title: 'Thông báo',
              text: 'Đã hủy trả hồ sơ!',
              icon: 'success',
            })

            sendEmailTTHCGiangVien(
              TEMPLATE_SUBJECT_CANCEL_EMAIL,
              '',
              { ...dataDetailYeuCau, ...newDataUpdate },
              dataCBGV,
              dataDetailTPHSYeuCau,
              contentEmail,
              linkAttachedFile,
              dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile,
              dataAttachedFile?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile,
            ).then(() => console.log('SEND EMAIL OK'))
            onLoading(true)
            onContentEmail('')
            setContentBGHPheDuyet('')
            setContentTPPheDuyet('')
            setTimeWork(null)
            setIsTPPheDuyet(null)
            setIsBGHPheDuyet(null)
            setErrorTimeWork(null)
            setIsSendEmail(null)
            onLinkAttachedFile('')
            onAttachedFile({
              MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile: '',
              MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile: '',
            })
          } else {
            return Swal.fire({
              icon: 'error',
              title:
                'Không tìm thấy trạng thái được thiết lập cho hồ sơ này để tiến hành cập nhật!',
            })
          }
        } else {
          Swal.fire('Đã dừng việc tiếp nhận hồ sơ', '', 'info')
        }
      })
    } else {
      return Swal.fire({
        icon: 'error',
        title: 'Hồ sơ đã được hủy trả!',
        text: 'Vui lòng thao tác xử lý tại các bước tiếp theo!',
      })
    }
  }

  const renderRadioPheDuyetJSX = (
    isTPPheDuyet,
    isBGHPheDuyet,
    isDoiTuongXuLy,
  ) => {
    if (isTPPheDuyet === true) {
      if (isBGHPheDuyet === true) {
        if (isDoiTuongXuLy === 24) {
          return (
            <div className="flex items-center gap-10 mb-2">
              <label
                htmlFor="isKhongPheDuyet"
                className="flex items-center gap-2"
              >
                <input
                  onChange={() => {
                    setIsTPPheDuyet(1)
                  }}
                  type="radio"
                  id="isKhongPheDuyet"
                  name="isTPXacNhanPheDuyet"
                />
                <span>Không duyệt</span>
              </label>
              <label htmlFor="isTrinhDuyet" className="flex items-center gap-2">
                <input
                  onChange={() => {
                    setIsTPPheDuyet(2)
                  }}
                  type="radio"
                  id="isTrinhDuyet"
                  name="isTPXacNhanPheDuyet"
                />
                <span>Trình duyệt</span>
              </label>
            </div>
          )
        } else if (isDoiTuongXuLy === 25) {
          return (
            <div className="flex items-center gap-10 mb-2">
              <label htmlFor="isPheDuyet" className="flex items-center gap-2">
                <input
                  onChange={() => {
                    setIsBGHPheDuyet(0)
                  }}
                  type="radio"
                  id="isPheDuyet"
                  name="isBGHXacNhanPheDuyet"
                />
                <span>Phê duyệt</span>
              </label>
              <label
                htmlFor="isKhongPheDuyet"
                className="flex items-center gap-2"
              >
                <input
                  onChange={() => {
                    setIsBGHPheDuyet(1)
                  }}
                  type="radio"
                  id="isKhongPheDuyet"
                  name="isBGHXacNhanPheDuyet"
                />
                <span>Không duyệt</span>
              </label>
            </div>
          )
        }
      } else {
        if (isDoiTuongXuLy === 24) {
          return (
            <div className="flex items-center gap-10 mb-2">
              <label htmlFor="isPheDuyet" className="flex items-center gap-2">
                <input
                  onChange={() => {
                    setIsTPPheDuyet(0)
                  }}
                  type="radio"
                  id="isPheDuyet"
                  name="isTPXacNhanPheDuyet"
                />
                <span>Phê duyệt</span>
              </label>
              <label
                htmlFor="isKhongPheDuyet"
                className="flex items-center gap-2"
              >
                <input
                  onChange={() => {
                    setIsTPPheDuyet(1)
                  }}
                  type="radio"
                  id="isKhongPheDuyet"
                  name="isTPXacNhanPheDuyet"
                />
                <span>Không duyệt</span>
              </label>
            </div>
          )
        }
      }
    } else {
      if (isBGHPheDuyet === true) {
        if (isDoiTuongXuLy === 25) {
          return (
            <div className="flex items-center gap-10 mb-2">
              <label htmlFor="isPheDuyet" className="flex items-center gap-2">
                <input
                  onChange={() => {
                    setIsBGHPheDuyet(0)
                  }}
                  type="radio"
                  id="isPheDuyet"
                  name="isBGHXacNhanPheDuyet"
                />
                <span>Phê duyệt</span>
              </label>
              <label
                htmlFor="isKhongPheDuyet"
                className="flex items-center gap-2"
              >
                <input
                  onChange={() => {
                    setIsBGHPheDuyet(1)
                  }}
                  type="radio"
                  id="isKhongPheDuyet"
                  name="isBGHXacNhanPheDuyet"
                />
                <span>Không duyệt</span>
              </label>
            </div>
          )
        }
      }
    }
  }

  const radioPheDuyetJSX = renderRadioPheDuyetJSX(
    dataDetailYeuCau?.MC_TTHC_GV_IsTruongPhongPheDuyet,
    dataDetailYeuCau?.MC_TTHC_GV_IsBGHPheDuyet,
    listStatus[currentStep - 1]?.MC_TTHC_GV_TrangThai_DoiTuongXuLy,
  )

  useEffect(() => {}, [dataDetailYeuCau])

  return (
    <div className="my-4">
      <div className="form__content border border-gray-400 p-4 rounded-lg mb-4">
        <h4 className="text-xl md:text-2xl text-center font-bold uppercase mb-6">
          Thông báo
        </h4>
        {/* START: Chọn gửi Email */}

        <div className={clsx('mb-6')}>
          <p className="font-semibold">Gửi email:</p>
          <div className="flex items-center gap-36 border p-2 rounded-md">
            {/* Checkbox gửi email cho Người dùng */}
            {((+dataDetailYeuCau?.MC_TTHC_GV_TrangThai_STT + 1 !==
              dataDetailYeuCau.MC_TTHC_GV_TrangThai_STT_TPD &&
              +dataDetailYeuCau?.MC_TTHC_GV_TrangThai_STT + 1 !==
                dataDetailYeuCau?.MC_TTHC_GV_TrangThai_STT_BGHD) ||
              dataDetailYeuCau?.MC_TTHC_GV_TrangThai_STT === null) && (
              <div
                className={clsx(
                  'flex items-center gap-2',
                  stepHandle === 2 && 'hidden',
                )}
              >
                <input
                  type="checkbox"
                  defaultChecked={true}
                  onChange={(e) => {
                    setSendEmailNguoiDung(e.target.checked)
                  }}
                  value={optionSendEmail[0].value}
                  name="isSendEmail"
                  id="isSendEmail"
                />
                <label htmlFor="isSendEmail">{optionSendEmail[0].label}</label>
              </div>
            )}

            {stepHandle === 2 && (
              <div className="flex items-center gap-2">
                <input
                  onChange={(e) => {
                    setSendEmailNguoiDung(e.target.checked)
                  }}
                  type="checkbox"
                  defaultChecked={true}
                  value={optionSendEmail[0].value}
                  name="isSendEmail"
                  id="isSendEmail"
                />
                <label htmlFor="isSendEmail">{optionSendEmail[0].label}</label>
              </div>
            )}
            {/* Checkbox gửi email cho CBNV */}
            {(dataDetailYeuCau?.MC_TTHC_GV_TrangThai_STT ==
              dataDetailYeuCau?.MC_TTHC_GV_TrangThai_STT_TPD - 1 ||
              dataDetailYeuCau?.MC_TTHC_GV_TrangThai_STT ==
                dataDetailYeuCau?.MC_TTHC_GV_TrangThai_STT_BGHD - 1) && (
              <div className="flex items-center gap-2">
                <input
                  onChange={(e) => {
                    setIsSendEmail(e.target.value)
                  }}
                  type="checkbox"
                  defaultChecked={true}
                  value={optionSendEmail[1].value}
                  disabled={false}
                  name="isSendEmail"
                  id="isSendEmail"
                />
                <label htmlFor="isSendEmail">{optionSendEmail[1].label}</label>
              </div>
            )}

            {/* Checkbox gửi email cho Trưởng phòng */}
            {(dataDetailYeuCau?.MC_TTHC_GV_TrangThai_STT ==
              dataDetailYeuCau?.MC_TTHC_GV_TrangThai_STT_TPD - 2 ||
              dataDetailYeuCau?.MC_TTHC_GV_TrangThai_STT ==
                dataDetailYeuCau?.MC_TTHC_GV_TrangThai_STT_BGHD - 1) && (
              <div className={clsx('flex items-center gap-2')}>
                <input
                  type="checkbox"
                  defaultChecked={true}
                  onChange={(e) => {
                    setSendEmailTruongPhong(e.target.checked)
                  }}
                  value={optionSendEmail[2].value}
                  name="isSendEmail"
                  id="isSendEmail"
                />
                <label htmlFor="isSendEmail">{optionSendEmail[2].label}</label>
              </div>
            )}
            {/* Checkbox gửi email cho BGH */}
            {dataDetailYeuCau?.MC_TTHC_GV_TrangThai_STT ==
              dataDetailYeuCau?.MC_TTHC_GV_TrangThai_STT_TPD - 1 &&
              dataDetailYeuCau?.MC_TTHC_GV_TrangThai_STT_TPD !== null && (
                <div
                  className={clsx(
                    'flex items-center gap-2',
                    !dataDetailYeuCau?.MC_TTHC_GV_IsBGHPheDuyet && 'hidden',
                  )}
                >
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    onChange={(e) => {
                      setSendEmailBGH(e.target.checked)
                    }}
                    value={optionSendEmail[3].value}
                    name="isSendEmail"
                    id="isSendEmail"
                  />
                  <label htmlFor="isSendEmail">
                    {optionSendEmail[3].label}
                  </label>
                </div>
              )}
          </div>
        </div>

        {/* START: Chọn Thời gian - Địa điểm (đối với hồ sơ mức độ 2, 3) */}
        {mucDoId === 2 && (
          <div className="grid grid-cols-2 gap-4 items-center mb-6">
            <div className="col-span-2 lg:col-span-1">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor=""
                  className="inline-block min-w-max font-semibold"
                >
                  {stepHandle === 1 && 'Ngày giờ nhận hồ sơ:'}
                  {stepHandle === 2 && 'Ngày giờ làm việc:'}
                  {stepHandle === 3 && 'Ngày giờ trả hồ sơ:'}
                  {stepHandle === 5 && 'Ngày giờ trả hồ sơ:'}
                </label>
                <DateTimePicker
                  label=""
                  onChange={(newValue) => {
                    setTimeWork(dayjs(newValue).format('DD/MM/YYYY HH:mm'))
                  }}
                  onError={(newError) => {
                    setErrorTimeWork(newError)
                  }}
                  className="p-2"
                  minDate={dayjs()}
                  minTime={dayjs().set('hour', 8).startOf('hour')}
                  maxTime={dayjs().set('hour', 17).startOf('hour')}
                />
              </div>
            </div>

            <div className="col-span-2 lg:col-span-1">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor=""
                  className="inline-block min-w-max font-semibold"
                >
                  {stepHandle === 1 && 'Địa điểm nhận hồ sơ:'}
                  {stepHandle === 2 && 'Địa điểm làm việc:'}
                  {stepHandle === 3 || stepHandle === 5
                    ? 'Địa điểm trả hồ sơ:'
                    : null}
                </label>
                <div className="">
                  <input
                    type="text"
                    placeholder="Nhập địa điểm"
                    className="w-full px-3 py-3.5 border border-gray-400 rounded-sm hover:outline-gray-600 focus:outline-blue-600"
                    onChange={(e) => {
                      setLocationWork(e.target.value)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {mucDoId === 3 && (
          <div className="grid grid-cols-2 gap-4 items-center mb-6">
            <div className="col-span-2 lg:col-span-1">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor=""
                  className="inline-block min-w-max font-semibold"
                >
                  {(stepHandle === 4 || stepHandle === 5) &&
                    'Ngày giờ trả hồ sơ:'}
                </label>
                <DateTimePicker
                  label=""
                  onChange={(newValue) => {
                    setTimeWork(dayjs(newValue).format('DD/MM/YYYY HH:mm'))
                  }}
                  onError={(newError) => {
                    setErrorTimeWork(newError)
                  }}
                  className="p-2"
                  minDate={dayjs()}
                  minTime={dayjs().set('hour', 8).startOf('hour')}
                  maxTime={dayjs().set('hour', 17).startOf('hour')}
                />
              </div>
            </div>

            <div className="col-span-2 lg:col-span-1">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor=""
                  className="inline-block min-w-max font-semibold"
                >
                  {(stepHandle === 4 || stepHandle === 5) &&
                    'Địa điểm trả hồ sơ:'}
                </label>
                <div className="">
                  <input
                    type="text"
                    placeholder="Nhập địa điểm"
                    className="w-full px-3 py-3.5 border border-gray-400 rounded-sm hover:outline-gray-600 focus:outline-blue-600"
                    onChange={(e) => {
                      setLocationWork(e.target.value)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {/* START: Chọn phê duyệt */}
        {radioPheDuyetJSX}
        {/* START: Nhập nội dung */}
        <div className="form__content--desc mb-2">
          <label htmlFor="form__content--desc" className="font-semibold">
            Nội dung <b className={clsx('text-red-500')}>*</b>:
          </label>
          <DebounceInput
            id="form__content--desc"
            element="textarea"
            className="w-full border border-slate-200 focus:outline-slate-400 px-3 py-2 rounded-lg"
            debounceTimeout={500}
            placeholder={'Nhập nội dung...'}
            onChange={(e) => {
              onContentEmail(e.target.value)
              setContentBGHPheDuyet(e.target.value)
              setContentTPPheDuyet(e.target.value)
            }}
          />
        </div>
        {/* START: Tài liệu kèm theo */}
        <div className="mb-2">
          <label htmlFor="" className="font-semibold">
            Tài liệu kèm theo
          </label>
          <div className="ml-6">
            <div className="flex flex-col mb-2">
              <label htmlFor="">Link tệp đính kèm:</label>
              <input
                type="text"
                className="px-3 py-2 border border-slate-200 focus:outline-slate-400"
                onChange={(e) => {
                  onLinkAttachedFile(e.target.value)
                }}
              />
            </div>
            <span className="mb-2">hoặc</span>
            <div className="flex flex-col mb-2">
              <label htmlFor="">Tệp đính kèm:</label>
              <input
                type="file"
                className={clsx(
                  'px-3 py-2 border border-slate-200 focus:outline-slate-400',
                  dataAttachedFile.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() ===
                    ''
                    ? 'block'
                    : 'hidden',
                )}
                value={''}
                onChange={async (e) => {
                  const file = e.target.files[0]
                  const dataFile = await convertDataFileToBase64(file)
                  const maxSizeInBytes = 5 * 1024 * 1024 // 5MB
                  if (!file.name.match(/\.(pdf)$/i)) {
                    Swal.fire({
                      icon: 'error',
                      title:
                        'Tệp tải lên không đúng định dạng yêu cầu. Vui lòng kiểm tra lại.',
                      text: 'Tệp tải lên phải có dạng PDF (Kích thước tối đa 5MB)',
                    })
                    return
                  } else {
                    if (file.size > maxSizeInBytes) {
                      Swal.fire({
                        icon: 'error',
                        title: 'Tệp tải lên vượt quá kích thước cho phép!',
                        text: 'Kích thước tối đa 5MB.',
                      })
                      onAttachedFile({
                        MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile: '',
                        MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile: '',
                      })
                      return
                    } else {
                      onAttachedFile({
                        MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile: file.name,
                        MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile: dataFile,
                      })
                    }
                  }
                }}
              />
              <div
                className={clsx(
                  dataAttachedFile.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile.trim() ===
                    ''
                    ? 'hidden'
                    : 'block',
                )}
              >
                <p>File đã chọn:</p>
                <div className="p-2 border flex items-center justify-between">
                  <span className="font-semibold inline-block">
                    {dataAttachedFile.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile}
                  </span>
                  <FaTrash
                    onClick={() => {
                      onAttachedFile({
                        MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile: '',
                        MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile: '',
                      })
                    }}
                    className="cursor-pointer hover:text-red-500"
                  />
                </div>
              </div>
              <span className="text-sm font-medium">
                Tệp đính kèm phải có dạng PDF (Kích thước tối đa 5MB)
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="form__action flex gap-4 justify-center">
        {currentStatusId === 0 && stepHandle === 1 && (
          <button
            onClick={handleTiepNhanHoSo}
            className="px-10 py-1 rounded-full font-medium border border-[#0484AC] focus:outline-[#0484AC] bg-[#0484AC] text-white shadow-sm hover:opacity-80 hover:shadow-xl"
          >
            Tiếp nhận
          </button>
        )}
        {stepHandle !== 1 && (
          <button
            onClick={handleThongBaoXuLyHoSo}
            className="px-10 py-1 rounded-full font-medium border border-[#0484AC] focus:outline-[#0484AC] bg-[#0484AC] text-white shadow-sm hover:opacity-80 hover:shadow-xl"
          >
            Gửi
          </button>
        )}
        <button
          onClick={handleCancelHoSo}
          className={clsx(
            'px-10 py-1 rounded-full font-medium border border-red-500 focus:outline-red-500 bg-red-500 text-white shadow-sm hover:opacity-80 hover:shadow-xl',
            infoStatus.MC_TTHC_GV_TrangThai_DoiTuongXuLy === 24 ||
              infoStatus.MC_TTHC_GV_TrangThai_DoiTuongXuLy === 25
              ? 'hidden'
              : null,
          )}
        >
          Hủy trả
        </button>
      </div>
    </div>
  )
}

FormGuiEmailThongBaoXuLy.propTypes = {}

export default FormGuiEmailThongBaoXuLy
