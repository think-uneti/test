import clsx from 'clsx'
import { useEffect, useMemo, useState, Suspense, lazy } from 'react'

import { FaCaretRight, FaCaretDown } from 'react-icons/fa'
import { FaCaretLeft } from 'react-icons/fa6'
import { useParams } from 'react-router-dom'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
const SidebarTTHCGV = lazy(() => import('../Sidebar/SidebarTTHCGV'))
import {
  getHoSoGuiYeuCauById,
  getQuyTrinhXuLyCBNV,
  putHoSoThuTucGuiYeuCauById,
} from '@/Apis/ThuTucHanhChinhGiangVien/apiThuTucHanhChinhGiangVien'
import moment from 'moment'
import {
  getThanhPhanHoSoByIdTTHCGV,
  getThanhPhanHoSoGuiYeuCauById,
} from '@/Apis/ThuTucHanhChinhGiangVien/apiThanhPhanHoSo'
import Swal from 'sweetalert2'
import {
  getListTrangThaiTTHCGVByIDGoc,
  getTrangThaiIDBySTTYeuCauId,
} from '@/Apis/ThuTucHanhChinhGiangVien/apiTrangThai'
import { toast } from 'react-toastify'
import { NguonTiepNhan_WEB } from '@/Services/Static/dataStatic'
import {
  TEMPLATE_SUBJECT_PENDING_EMAIL,
  TEMPLATE_SUBJECT_RECEIVED_EMAIL,
  sendEmailTTHCGiangVien,
} from '@/Services/Utils/emailUtils'
import { DataCanBoGV } from '@/Services/Utils/dataCanBoGV'
import {
  convertBufferToBase64,
  convertDataFileToBase64,
} from '@/Services/Utils/stringUtils'
import Loading from '@/Components/Loading/Loading'
import { DebounceInput } from 'react-debounce-input'
import ReactPaginate from 'react-paginate'
// import { handleOpenFileBase64 } from '@/Services/Utils/fileUtils'
import { BiChevronDown } from 'react-icons/bi'
import { AiOutlineSearch } from 'react-icons/ai'
import { getListNoiTraKetQua } from '@/Apis/ThuTucHanhChinhGiangVien/apiThuTucHanhChinhGiangVien'
import { listMucDoThuTuc } from '../constants'
const FormGuiEmailThongBaoXuLy = lazy(
  () => import('./FormGuiEmailThongBaoXuLy'),
)
import { FaCheck } from 'react-icons/fa'
import { handlePreviewFileBase64 } from '@/Services/Utils/fileUtils'
import { getInfoPhanQuyenCBNV } from '@/Apis/ThuTucHanhChinhGiangVien/apiPhanQuyen'

function ChiTietHoSoYeuCau() {
  const { id } = useParams()

  const [showThongTinNguoiNop, setShowThongTinNguoiNop] = useState(true)
  const [showThongTinHoSo, setShowThongTinHoSo] = useState(true)
  //   const [showXuLyHoSo, setShowXuLyHoSo] = useState(true)
  const [showQuaTrinhXuLy, setShowQuaTrinhXuLy] = useState(true)
  const [dataDetailYeuCau, setDataDetailYeuCau] = useState(null)
  const [dataDetailTPHSYeuCau, setDataDetailTPHSYeuCauYeuCau] = useState(null)
  const [ngayHenTra, setNgayHenTra] = useState(null)
  const [ngayGiaoTra, setNgayGiaoTra] = useState(null)
  const [hinhThucTra, setHinhThucTra] = useState('')
  const [diaDiemTra, setDiaDiemTra] = useState('')
  const [listQuyTrinhXuLy, setListQuyTrinhXuLy] = useState([])
  const [listNoiTraKetQua, setListNoiTraKetQua] = useState(null)
  const [trangThaiGhiChu, setTrangThaiGhiChu] = useState('')
  const [listTrangThaiYeuCau, setListTrangThaiYeuCau] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchNoiTraKetQua, setSearchNoiTraKetQua] = useState('')
  const [openSelectNoiTraKetQua, setOpenSelectNoiTraKetQua] = useState(false)
  const [linkFileTraKetQuaOnline, setLinkFileTraKetQuaOnline] = useState('')
  const [dataFileTraKetQuaKemTheo, setDataFileTraKetQuaKemTheo] = useState({
    MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile: '',
    MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile: '',
  })
  const [listDataCBNVPhanQuyen, setListDataCBNVPhanQuyen] = useState([])
  //   const navigate = useNavigate()

  //   let khoaGiangVien = ''
  const dataCBGV = DataCanBoGV()

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  const pageCount = Math.ceil(listQuyTrinhXuLy?.length / parseInt(itemsPerPage))
  const paginateListQuyTrinhXuLy = listQuyTrinhXuLy?.slice(
    currentPage * parseInt(itemsPerPage),
    (currentPage + 1) * parseInt(itemsPerPage),
  )

  // call data
  const getDataHoSoYeuCauById = async (id) => {
    const res = await getHoSoGuiYeuCauById(id)
    if (res.status === 200) {
      const data = await res.data?.body[0]
      setLoading(false)
      setDataDetailYeuCau(data)
      setNgayHenTra(data?.MC_TTHC_GV_GuiYeuCau_NgayHenTra)
      setNgayGiaoTra(data?.MC_TTHC_GV_GuiYeuCau_NgayGiaoTra)
    }
  }
  const getDataTPHSDeNghiYeuCauByIDGoc = async (id) => {
    const res = await getThanhPhanHoSoGuiYeuCauById(id)
    if (res.status === 200) {
      setDataDetailTPHSYeuCauYeuCau(res.data?.body)
      setLoading(false)
    }
  }
  const getDataTrinhTuThucHienYeuCauByIDGoc = async (id) => {
    const res = await getQuyTrinhXuLyCBNV(id)
    if (res.status === 200) {
      const data = await res.data?.body
      setListQuyTrinhXuLy(data)
      setLoading(false)
    }
  }
  const getDataTrangThaiYeuCauByIDGoc = async (id) => {
    const res = await getListTrangThaiTTHCGVByIDGoc(id)
    if (res.status === 200) {
      const data = await res.data?.body
      setListTrangThaiYeuCau(data)
      setLoading(false)
    }
  }

  const getListDataNoiTraKetQua = async () => {
    try {
      const res = await getListNoiTraKetQua()
      if (res.status === 200) {
        const data = await res.data?.body
        setListNoiTraKetQua(data)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const getListDataPhanQuyenByIDGoc = async (idGocTTHC) => {
    try {
      const res = await getInfoPhanQuyenCBNV(idGocTTHC)
      if (res.status === 200) {
        const data = await res.data?.body
        setListDataCBNVPhanQuyen(data)
        setLoading(false)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  // event handlers
  const handleChangeValue = (e) => {
    const { id, name, value } = e.target

    if (id == 'MC_TTHC_GV_GuiYeuCau_NgayHenTra') {
      setNgayHenTra(moment(value).format('DD/MM/YYYY HH:mm:ss'))
    }

    if (id == 'NgayGiaoTra') {
      let strNgayGiaoTra = moment(value).format('DD/MM/YYYY HH:mm:ss')
      setNgayGiaoTra(strNgayGiaoTra)
    }

    if (name == 'HinhThucTra') {
      setHinhThucTra(value)
    }
  }

  const handleShowThongTinNguoiNop = () => {
    setShowThongTinNguoiNop(!showThongTinNguoiNop)
  }

  const handleShowThongTinHoSo = () => {
    setShowThongTinHoSo(!showThongTinHoSo)
  }

  const handleShowQuaTrinhXuLyHoSo = () => {
    setShowQuaTrinhXuLy(!showQuaTrinhXuLy)
  }

  const handleUpdateYeuCauGui = async (yeuCauID, trangThaiID) => {
    let listTPHSDeNghiYeuCau = []
    try {
      const resListTPHSDeNghiYeuCau = await getThanhPhanHoSoByIdTTHCGV(
        dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_YeuCau_ID,
      )
      if (resListTPHSDeNghiYeuCau.status === 200) {
        const data = await resListTPHSDeNghiYeuCau.data?.body
        listTPHSDeNghiYeuCau = [...data]
      }
    } catch (error) {
      console.log(error.message)
    }

    if (trangThaiID == 0) {
      Swal.fire({
        title: 'Hồ sơ yêu cầu chưa được tiếp nhận!',
        text: 'Bạn có muốn tiếp nhận hồ sơ để tiếp tục xử lý yêu cầu?',
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy',
      }).then(async (result) => {
        if (result.isConfirmed) {
          const resNewTrangThaiID = await getTrangThaiIDBySTTYeuCauId(
            yeuCauID,
            1,
          )
          if (resNewTrangThaiID.status === 200) {
            const dataTrangThaiIDNew = await resNewTrangThaiID.data?.body[0]
            if (dataTrangThaiIDNew) {
              const newDataUpdate = {
                ...dataDetailYeuCau,
                MC_TTHC_GV_GuiYeuCau_TrangThai_ID:
                  dataTrangThaiIDNew?.MC_TTHC_GV_TrangThai_ID,
                MC_TTHC_GV_GuiYeuCau_TrangThai_GhiChu:
                  dataTrangThaiIDNew?.MC_TTHC_GV_TrangThai_MoTa
                    ? dataTrangThaiIDNew?.MC_TTHC_GV_TrangThai_MoTa
                    : dataTrangThaiIDNew?.MC_TTHC_GV_TrangThai_TenTrangThai,
              }

              const resPutHoSoThuTuc =
                await putHoSoThuTucGuiYeuCauById(newDataUpdate)

              if (resPutHoSoThuTuc.status === 200) {
                Swal.fire({
                  title: 'Thông báo',
                  text: 'Đã tiếp nhận hồ sơ! Tiếp tục xử lý yêu cầu!',
                  icon: 'success',
                })

                sendEmailTTHCGiangVien(
                  TEMPLATE_SUBJECT_RECEIVED_EMAIL,
                  { ...dataDetailYeuCau, ...newDataUpdate },
                  dataCBGV,
                  listTPHSDeNghiYeuCau,
                  newDataUpdate.MC_TTHC_GV_GuiYeuCau_TrangThai_GhiChu,
                  '',
                  '',
                ).then((res) => console.log('SEND EMAIL OK', res))
                getDataHoSoYeuCauById(id)
                getDataTrinhTuThucHienYeuCauByIDGoc(id)
              }
            } else {
              return Swal.fire({
                icon: 'error',
                title:
                  'Không tìm thấy trạng thái được thiết lập cho hồ sơ này để tiến hành cập nhật!',
              })
            }
          }
        } else {
          toast.success('Đã huỷ tiếp nhận hồ sơ!')
          return
        }
      })
    } else {
      let newDataUpdate = {
        MC_TTHC_GV_GuiYeuCau_ID: dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_ID,
        MC_TTHC_GV_GuiYeuCau_NhanSuGui_MaNhanSu:
          dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_NhanSuGui_MaNhanSu,
        MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email:
          dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email,
        MC_TTHC_GV_GuiYeuCau_NhanSuGui_SDT:
          dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_NhanSuGui_SDT,
        MC_TTHC_GV_GuiYeuCau_NhanSuGui_Khoa:
          dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Khoa,
        MC_TTHC_GV_GuiYeuCau_YeuCau_ID:
          dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_YeuCau_ID,
        MC_TTHC_GV_GuiYeuCau_YeuCau_GhiChu:
          dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_YeuCau_GhiChu,
        MC_TTHC_GV_GuiYeuCau_TrangThai_ID:
          dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_TrangThai_ID,
        MC_TTHC_GV_GuiYeuCau_TrangThai_GhiChu: trangThaiGhiChu,
        MC_TTHC_GV_GuiYeuCau_NgayGui:
          dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_NgayGui,
        MC_TTHC_GV_GuiYeuCau_KetQua_SoLuong:
          dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_KetQua_SoLuong,
        MC_TTHC_GV_GuiYeuCau_DaNop: false,
        MC_TTHC_GV_GuiYeuCau_NgayHenTra: ngayHenTra,
        MC_TTHC_GV_GuiYeuCau_NgayGiaoTra: ngayGiaoTra,
        MC_TTHC_GV_GuiYeuCau_NoiTraKetQua: diaDiemTra,
        ...dataFileTraKetQuaKemTheo,
        MC_TTHC_GV_GuiYeuCau_NguonTiepNhan: NguonTiepNhan_WEB,
      }

      // console.log('>>> newDataUpdate: ', newDataUpdate)
      // return

      // Ngày update
      let strCurrentDateHenTra = moment(
        dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_NgayHenTra,
      )
        .format('DD/MM/YYYY HH:mm')
        .toString()
      let strCurrentDateGiaoTra = moment(
        dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_NgayGiaoTra,
      )
        .format('DD/MM/YYYY HH:mm')
        .toString()
      let strNewDateHenTra = moment(ngayHenTra)
        .format('DD/MM/YYYY HH:mm')
        .toString()
      let strNewDateGiaoTra = moment(ngayGiaoTra)
        .format('DD/MM/YYYY HH:mm')
        .toString()

      let contentReply = ''
      // Hình thức trả: Email
      if (hinhThucTra == '1') {
        Swal.fire({
          icon: 'question',
          title: 'Bạn có chắc chắn muốn cập nhật hồ sơ?',
          text: 'Sau khi cập nhật, các nội dung thay đổi sẽ tự động gửi email thông báo đến người gửi!',
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Đồng ý',
          cancelButtonText: 'Hủy',
        }).then(async (result) => {
          if (result.isConfirmed) {
            const resUpdateYeuCau = await putHoSoThuTucGuiYeuCauById({
              ...newDataUpdate,
            })

            const patternLink = /^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/gm
            let checkLinkFileTraKetQuaOnline
            if (linkFileTraKetQuaOnline !== '') {
              checkLinkFileTraKetQuaOnline = patternLink.test(
                linkFileTraKetQuaOnline,
              )
            }

            if (checkLinkFileTraKetQuaOnline == false) {
              Swal.fire({
                icon: 'error',
                title: 'Vui lòng nhập đúng đường link của tệp đính kèm!',
              })
              return
            }

            if (newDataUpdate?.MC_TTHC_GV_GuiYeuCau_TrangThai_GhiChu == '') {
              contentReply = `Hồ sơ của quý Thầy/Cô đã được xử lý thành công.${
                linkFileTraKetQuaOnline
                  ? ' Đường dẫn file đính kèm: ' + linkFileTraKetQuaOnline
                  : ''
              } `
            } else {
              contentReply = `Hồ sơ của quý Thầy/Cô đã được xử lý thành công. ${
                linkFileTraKetQuaOnline
                  ? 'Đường dẫn file đính kèm: ' + linkFileTraKetQuaOnline + '.'
                  : ''
              } Nội dung lưu ý: ${
                newDataUpdate?.MC_TTHC_GV_GuiYeuCau_TrangThai_GhiChu
              }`
            }

            if (resUpdateYeuCau.status === 200) {
              Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Đã gửi thông báo xử lý hoàn thành hồ sơ thủ tục qua email!',
              })
              sendEmailTTHCGiangVien(
                TEMPLATE_SUBJECT_PENDING_EMAIL,
                { ...dataDetailYeuCau, ...newDataUpdate },
                dataCBGV,
                listTPHSDeNghiYeuCau,
                contentReply,
                newDataUpdate?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile,
                newDataUpdate?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile,
              ).then((res) => console.log('SEND EMAIL OK', res))
              getDataHoSoYeuCauById(id)
              getDataTrinhTuThucHienYeuCauByIDGoc(id)
            }
          }
        })
      } else if (hinhThucTra == '2') {
        //Hình thức trả: trực tiếp
        if (!diaDiemTra) {
          return toast.error('Vui lòng chọn địa điểm giao trả!')
        } else {
          Swal.fire({
            icon: 'question',
            title: 'Bạn có chắc chắn muốn cập nhật thông tin hồ sơ này?',
            text: '',
            showCancelButton: true,
            confirmButtonText: 'Lưu cập nhật',
            cancelButtonText: 'Hủy',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
          }).then(async (result) => {
            if (result.isConfirmed) {
              const resUpdateYeuCau = await putHoSoThuTucGuiYeuCauById({
                ...newDataUpdate,
                MC_TTHC_GV_GuiYeuCau_NgayHenTra: moment(ngayHenTra).format(
                  'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
                ),
                MC_TTHC_GV_GuiYeuCau_NgayGiaoTra: moment(ngayGiaoTra).format(
                  'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
                ),
                MC_TTHC_GV_GuiYeuCau_NoiTraKetQua: diaDiemTra,
              })
              if (resUpdateYeuCau.status === 200) {
                toast.success('Cập nhật thông tin thành công!')
                if (ngayHenTra && ngayGiaoTra) {
                  contentReply = `Hồ sơ của quý Thầy/Cô đã được xử lý. Ngày hẹn trả ${moment(
                    newDataUpdate?.MC_TTHC_GV_GuiYeuCau_NgayHenTra,
                  ).format('DD/MM/YYYY HH:mm:ss')} - Ngày giao trả ${moment(
                    newDataUpdate?.MC_TTHC_GV_GuiYeuCau_NgayGiaoTra,
                  ).format('DD/MM/YYYY HH:mm:ss')}. Nội dung lưu ý: ${
                    newDataUpdate.MC_TTHC_GV_GuiYeuCau_TrangThai_GhiChu
                  }`
                } else if (ngayHenTra) {
                  contentReply = `Hồ sơ của quý Thầy/Cô đã được xử lý. Ngày hẹn trả ${moment(
                    newDataUpdate?.MC_TTHC_GV_GuiYeuCau_NgayHenTra,
                  ).format('DD/MM/YYYY HH:mm:ss')}. Nội dung lưu ý: ${
                    newDataUpdate.MC_TTHC_GV_GuiYeuCau_TrangThai_GhiChu
                  }`
                } else if (ngayGiaoTra) {
                  contentReply = `Hồ sơ của quý Thầy/Cô đã được xử lý. Ngày giao trả ${moment(
                    newDataUpdate?.MC_TTHC_GV_GuiYeuCau_NgayGiaoTra,
                  ).format('DD/MM/YYYY HH:mm:ss')}. Nội dung lưu ý: ${
                    newDataUpdate.MC_TTHC_GV_GuiYeuCau_TrangThai_GhiChu
                  }`
                }

                sendEmailTTHCGiangVien(
                  TEMPLATE_SUBJECT_PENDING_EMAIL,
                  { ...dataDetailYeuCau, ...newDataUpdate },
                  dataCBGV,
                  listTPHSDeNghiYeuCau,
                  contentReply,
                  newDataUpdate?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile,
                  newDataUpdate?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile,
                ).then((res) => console.log('SEND EMAIL OK', res))
                getDataHoSoYeuCauById(id)
                getDataTrinhTuThucHienYeuCauByIDGoc(id)
                return
              }
            }
          })
          return
        }
      } else {
        if (
          strNewDateHenTra != strCurrentDateHenTra ||
          strNewDateGiaoTra != strCurrentDateGiaoTra
        ) {
          Swal.fire({
            icon: 'question',
            title: 'Bạn có muốn cập nhật thông tin này?',
            text: 'Sau khi cập nhật, hệ thống sẽ tự động gửi mail thông báo cho người gửi!',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Huỷ',
          }).then(async (result) => {
            if (result.isConfirmed) {
              const res = await putHoSoThuTucGuiYeuCauById(newDataUpdate)
              if (res.status === 200) {
                toast.success('Cập nhật thành công thông tin yêu cầu!')
                sendEmailTTHCGiangVien(
                  TEMPLATE_SUBJECT_PENDING_EMAIL,
                  { ...dataDetailYeuCau, ...newDataUpdate },
                  dataCBGV,
                  listTPHSDeNghiYeuCau,
                  newDataUpdate.MC_TTHC_GV_GuiYeuCau_TrangThai_GhiChu,
                  newDataUpdate?.MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile,
                  newDataUpdate?.MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile,
                ).then((res) => console.log('SEND EMAIL OK', res))
                getDataHoSoYeuCauById(id)
                getDataTrinhTuThucHienYeuCauByIDGoc(id)
              }
            }
          })
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Không có thông tin nào được thay đổi để cập nhật',
            text: 'Vui lòng thay đổi thông tin để thực hiện cập nhật mới!',
          })
        }
      }
    }
  }

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected)
  }

  // effects
  useEffect(() => {
    getListDataNoiTraKetQua()
  }, [])
  useEffect(() => {
    const fetchData = async () => {
      await getDataHoSoYeuCauById(id)
      await getDataTPHSDeNghiYeuCauByIDGoc(id)
      await getDataTrinhTuThucHienYeuCauByIDGoc(id)
    }
    fetchData()
  }, [id, loading])

  useEffect(() => {
    if (dataDetailYeuCau) {
      const fetchData = async () => {
        await getDataTrangThaiYeuCauByIDGoc(
          dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_YeuCau_ID,
        )
        await getListDataPhanQuyenByIDGoc(
          dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_YeuCau_ID,
        )
      }
      fetchData()
    }
  }, [dataDetailYeuCau, id])

  const displayedListQuyTrinhXuLy = useMemo(() => {
    if (!showQuaTrinhXuLy) {
      return paginateListQuyTrinhXuLy
    }
    return []
  }, [paginateListQuyTrinhXuLy, showQuaTrinhXuLy])

  if (dataDetailYeuCau) {
    return (
      <div className="px-5 lg:px-0 grid grid-cols-12 gap-4 ">
        {loading ? (
          <div className="relative left-0 right-0 w-full flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          <Suspense fallback={<Loading />}>
            <div className="col-span-12 lg:col-span-2">
              <SidebarTTHCGV />
            </div>
            <div className="col-span-12 lg:col-span-10">
              <div className="w-full p-4 bg-white shadow-lg rounded-xl">
                {/* START: Thông tin người nộp */}
                <div className="mb-4">
                  <div className="flex flex-row items-center gap-2 bg-[#0484AC] text-white font-semibold px-3 py-1 rounded-md mb-4">
                    {showThongTinNguoiNop ? (
                      <FaCaretDown
                        className="text-white cursor-pointer"
                        onClick={handleShowThongTinNguoiNop}
                      />
                    ) : (
                      <FaCaretRight
                        className="text-white cursor-pointer"
                        onClick={handleShowThongTinNguoiNop}
                      />
                    )}
                    <h4>Thông tin người nộp hồ sơ</h4>
                  </div>

                  <div
                    className={clsx(
                      'grid grid-cols-2 items-center justify-between',
                      showThongTinNguoiNop ? null : 'hidden',
                    )}
                  >
                    <p className="col-span-2 md:col-span-1 mb-4">
                      Mã nhân sự:{' '}
                      <span className="font-semibold">
                        {dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_NhanSuGui_MaNhanSu ??
                          'Chưa cập nhật'}
                      </span>
                    </p>
                    <p className="col-span-2 md:col-span-1 mb-4">
                      Họ và tên:{' '}
                      <span className="font-semibold">
                        {dataDetailYeuCau?.HoTen}
                      </span>
                    </p>

                    <p className="col-span-2 md:col-span-1 mb-4">
                      Ngày sinh:{' '}
                      <span className="font-semibold">
                        {dataDetailYeuCau?.NgaySinh
                          ? moment(dataDetailYeuCau?.NgaySinh).format(
                              'DD/MM/YYYY',
                            )
                          : ''}
                      </span>
                    </p>
                    <p className="col-span-2 md:col-span-1 mb-4">
                      Điện thoại:{' '}
                      <span className="font-semibold">
                        {dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_NhanSuGui_SDT ??
                          'Chưa cập nhật'}
                      </span>
                    </p>
                    <p className="col-span-2 md:col-span-1 mb-4">
                      Email:{' '}
                      <span className="font-semibold whitespace-pre-wrap">
                        {dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email}
                      </span>
                    </p>
                    <p className="col-span-2 md:col-span-1 mb-4">
                      Đơn vị:{' '}
                      <span className="font-semibold">
                        {dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Khoa ??
                          'Chưa cập nhật'}
                      </span>
                    </p>
                  </div>
                </div>
                {/* END: Thông tin người nộp */}

                {/* START: Thông tin hồ sơ */}
                <div className="mb-4">
                  <div className="flex flex-row items-center gap-2 bg-[#0484AC] text-white font-semibold px-3 py-1 rounded-md mb-4">
                    {showThongTinHoSo ? (
                      <FaCaretDown
                        className="text-white cursor-pointer"
                        onClick={handleShowThongTinHoSo}
                      />
                    ) : (
                      <FaCaretRight
                        className="text-white cursor-pointer"
                        onClick={handleShowThongTinHoSo}
                      />
                    )}
                    <h4>Thông tin hồ sơ</h4>
                  </div>

                  {/* START: Thông tin */}
                  <div
                    className={clsx(
                      'grid grid-cols-2 gap-x-4 items-center justify-between mb-4',
                      showThongTinHoSo ? null : 'hidden',
                    )}
                  >
                    {/* Lĩnh vực */}
                    <p className="col-span-1 mb-4">
                      Lĩnh vực:{' '}
                      <span className="font-semibold">
                        {dataDetailYeuCau?.MC_TTHC_GV_LinhVuc}
                      </span>
                    </p>

                    {/* Mã thủ tục */}
                    <p className="col-span-2 md:col-span-1 mb-4">
                      Mã thủ tục:{' '}
                      <span className="font-semibold">
                        {dataDetailYeuCau?.MC_TTHC_GV_MaThuTuc}
                      </span>
                    </p>

                    {/* Tên thủ tục */}
                    <p className="col-span-1 md:col-span-1 mb-4">
                      Tên thủ tục:{' '}
                      <span className="font-semibold">
                        {dataDetailYeuCau?.MC_TTHC_GV_TenThuTuc}
                      </span>
                    </p>

                    {/* Mức độ thủ tục */}
                    <p className="col-span-2 md:col-span-1 mb-4">
                      Mức độ thủ tục:{' '}
                      <span className="font-semibold">
                        {listMucDoThuTuc.map((md) => {
                          if (md.id === dataDetailYeuCau?.MC_TTHC_GV_IDMucDo) {
                            return `${dataDetailYeuCau?.MC_TTHC_GV_IDMucDo} - ${md.moTaMucDo}`
                          }
                        })}
                      </span>
                    </p>
                    {/* Ngày nộp hồ sơ */}
                    <p className="col-span-1 mb-4">
                      Ngày nộp hồ sơ:{' '}
                      <span className="font-semibold">
                        {dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_NgayGui &&
                          moment(
                            dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_NgayGui,
                          ).format('DD/MM/YYYY')}
                      </span>
                    </p>
                    {/* Đơn vị tiếp nhận */}
                    <p className="col-span-1 mb-4">
                      Đơn vị tiếp nhận:{' '}
                      <span className="font-semibold">
                        {dataDetailYeuCau?.MC_TTHC_GV_NoiTiepNhan}
                      </span>
                    </p>

                    {/* START: Thành phần hồ show */}
                    {dataDetailTPHSYeuCau?.length > 0 && (
                      <div className="col-span-2 mb-4">
                        <p className="font-semibold">Giấy tờ kèm theo:</p>
                        <table className="w-full">
                          <thead className="bg-[#075985] text-white ">
                            <tr>
                              <th className="border-r px-2 py-1 rounded-tl-xl">
                                STT
                              </th>
                              <th className="border-r px-2 py-1">
                                Tên giấy tờ
                              </th>
                              <th className="border-r px-2 py-1 rounded-tr-xl">
                                Giấy tờ kèm theo
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {dataDetailTPHSYeuCau &&
                              dataDetailTPHSYeuCau?.map(
                                (iTPHSYeuCau, index) => {
                                  return (
                                    <tr className="border" key={index}>
                                      <td className="border-r px-2 py-1 text-center">
                                        {index + 1}
                                      </td>
                                      <td className="border-r px-2 py-1">
                                        <p className="">
                                          {
                                            iTPHSYeuCau?.MC_TTHC_GV_ThanhPhanHoSo_TenGiayTo
                                          }
                                        </p>
                                      </td>
                                      <td className="border-r px-2 py-1 text-center">
                                        <button
                                          type="button"
                                          className="text-[#336699] font-medium"
                                          onClick={() => {
                                            const base64StringWithoutPrefix =
                                              convertBufferToBase64(
                                                iTPHSYeuCau
                                                  ?.MC_TTHC_GV_ThanhPhanHoSo_GuiYeuCau_DataFile
                                                  ?.data,
                                              )
                                            handlePreviewFileBase64(
                                              iTPHSYeuCau?.MC_TTHC_GV_ThanhPhanHoSo_GuiYeuCau_TenFile,
                                              base64StringWithoutPrefix,
                                            )
                                          }}
                                        >
                                          Xem
                                        </button>
                                      </td>
                                    </tr>
                                  )
                                },
                              )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Nội dung yêu cầu của người gửi */}
                    <div className="col-span-1 mb-4">
                      <p>Nội dung yêu cầu của người gửi: </p>
                      {dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_YeuCau_GhiChu ? (
                        <Markdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeKatex]}
                          className={'px-6 font-medium'}
                        >
                          {dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_YeuCau_GhiChu}
                        </Markdown>
                      ) : (
                        'Không có nội dung yêu cầu'
                      )}
                    </div>

                    {/* START: Cập nhật/Xử lý hồ sơ */}
                    <div className="hidden col-span-2">
                      <div className="grid grid-cols-2 gap-2 border border-slate-400 p-2">
                        {/* START: Hình thức trả */}
                        <div className="flex flex-col gap-2 col-span-1">
                          <p>Hình thức giao trả:</p>

                          {dataDetailYeuCau?.MC_TTHC_GV_IDMucDo === 4 && (
                            <label
                              htmlFor="HinhThucTra_Online"
                              className="flex items-center gap-2"
                            >
                              <input
                                type="radio"
                                name="HinhThucTra"
                                id="HinhThucTra_Online"
                                value="1"
                                onChange={handleChangeValue}
                              />
                              Trả online - Email
                            </label>
                          )}
                          <label
                            htmlFor="HinhThucTra_TrucTiep"
                            className="flex items-center gap-2"
                          >
                            <input
                              type="radio"
                              name="HinhThucTra"
                              id="HinhThucTra_TrucTiep"
                              value="2"
                              onChange={handleChangeValue}
                            />
                            <span>Trả trực tiếp</span>
                          </label>
                        </div>
                        {hinhThucTra == '1' && (
                          <>
                            <div className="flex flex-col gap-2 col-span-2">
                              <p>Link tệp đính kèm (nếu có):</p>
                              <input
                                type="text"
                                className="p-2 border focus:outline-slate-400"
                                placeholder="Link tệp đính kèm"
                                pattern="/^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/gm"
                                onChange={(e) => {
                                  setLinkFileTraKetQuaOnline(e.target.value)
                                }}
                              />
                            </div>

                            <div className="flex flex-col gap-2 col-span-2">
                              <p>Tệp đính kèm (nếu có):</p>
                              <input
                                type="file"
                                className="p-2 border focus:outline-slate-400"
                                placeholder="Tệp đính kèm"
                                accept="*/,.pdf"
                                onChange={async (e) => {
                                  const file = e.target.files[0]
                                  const dataFile =
                                    await convertDataFileToBase64(file)
                                  const maxSizeInBytes = 5 * 1024 * 1024 // 5MB
                                  if (!file.name.match(/\.(pdf)$/i)) {
                                    Swal.fire({
                                      icon: 'error',
                                      title:
                                        'Tệp tải lên không đúng định dạng yêu cầu. Vui lòng kiểm tra lại.',
                                      text: 'Tệp tải lên phải có dạng PDF (Kích thước tối đa 5MB)',
                                    })
                                    // setDataFilesTepThuTuc(null)
                                    return
                                  } else {
                                    if (file.size > maxSizeInBytes) {
                                      Swal.fire({
                                        icon: 'error',
                                        title:
                                          'Tệp tải lên vượt quá kích thước cho phép!',
                                        text: 'Kích thước tối đa 5MB.',
                                      })
                                      setDataFileTraKetQuaKemTheo({
                                        MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile:
                                          '',
                                        MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile:
                                          '',
                                      })
                                      return
                                    } else {
                                      setDataFileTraKetQuaKemTheo({
                                        MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile:
                                          file.name,
                                        MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile:
                                          dataFile,
                                      })
                                    }
                                  }
                                }}
                              />
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                                Tệp đính kèm phải có dạng{' '}
                                <span className="font-medium">PDF</span>
                                <span className="ml-1 font-medium text-red-600">
                                  (Kích thước tối đa 5MB)
                                </span>
                              </p>
                            </div>
                          </>
                        )}
                        {hinhThucTra == '2' ? (
                          <>
                            <div className="flex flex-col gap-2">
                              <p>Địa điểm giao trả:</p>
                              <div className="col-span-4 md:col-span-2 relative">
                                <div
                                  id="MC_TTHC_GV_GuiYeuCau_NoiTraKetQua"
                                  onClick={() => {
                                    setOpenSelectNoiTraKetQua(
                                      !openSelectNoiTraKetQua,
                                    )
                                  }}
                                  className="bg-white w-full p-2 flex items-center justify-between rounded-md border border-slate-300 cursor-pointer"
                                >
                                  <span
                                    className={clsx(
                                      diaDiemTra &&
                                        'text-gray-700 font-semibold',
                                    )}
                                  >
                                    {diaDiemTra
                                      ? diaDiemTra
                                      : 'Chọn nơi trả kết quả'}
                                  </span>
                                  <BiChevronDown
                                    size={20}
                                    className={clsx(
                                      openSelectNoiTraKetQua && 'rotate-180',
                                    )}
                                  />
                                </div>
                                <ul
                                  className={clsx(
                                    'bg-white mt-2 border shadow-sm overflow-y-auto absolute right-0 left-0 top-full',
                                    openSelectNoiTraKetQua
                                      ? 'max-h-60'
                                      : 'hidden',
                                  )}
                                >
                                  <div className="flex items-center px-2 sticky top-0 bg-white shadow-md">
                                    <AiOutlineSearch
                                      size={18}
                                      className="text-gray-700"
                                    />
                                    <input
                                      type="text"
                                      value={searchNoiTraKetQua}
                                      onChange={(e) => {
                                        setSearchNoiTraKetQua(e.target.value)
                                      }}
                                      placeholder="Nhập nơi trả kết quả..."
                                      className="w-full placeholder:text-gray-500 p-2 outline-none"
                                    />
                                  </div>
                                  {searchNoiTraKetQua ? (
                                    <li
                                      className={clsx(
                                        'font-semibold px-2 py-3 text-sm cursor-pointer hover:bg-sky-600 hover:text-white',
                                      )}
                                      onClick={() => {
                                        setDiaDiemTra(searchNoiTraKetQua)
                                        setOpenSelectNoiTraKetQua(false)
                                        setSearchNoiTraKetQua('')
                                      }}
                                    >
                                      {searchNoiTraKetQua}
                                    </li>
                                  ) : null}
                                  {listNoiTraKetQua &&
                                    listNoiTraKetQua?.map((iDiaChi, index) => {
                                      return (
                                        <li
                                          key={index}
                                          className={clsx(
                                            'p-2 text-sm cursor-pointer hover:bg-sky-600 hover:text-white',
                                            iDiaChi?.MC_TTHC_GV_NoiTraKetQua.toLowerCase().includes(
                                              searchNoiTraKetQua,
                                            )
                                              ? 'block'
                                              : 'hidden',
                                          )}
                                          onClick={() => {
                                            setDiaDiemTra(
                                              iDiaChi?.MC_TTHC_GV_NoiTraKetQua,
                                            )
                                            setOpenSelectNoiTraKetQua(false)
                                            setSearchNoiTraKetQua('')
                                          }}
                                        >
                                          {iDiaChi?.MC_TTHC_GV_NoiTraKetQua}
                                        </li>
                                      )
                                    })}
                                </ul>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <p>Ngày hẹn trả:</p>
                              <input
                                type="datetime-local"
                                className="p-2 border"
                                name="MC_TTHC_GV_GuiYeuCau_NgayHenTra"
                                id="MC_TTHC_GV_GuiYeuCau_NgayHenTra"
                                value={moment(ngayHenTra).format(
                                  'YYYY-MM-DDTHH:mm',
                                )}
                                onChange={(e) => {
                                  setNgayHenTra(e.target.value)
                                }}
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <p>Ngày giao trả:</p>
                              <input
                                type="datetime-local"
                                className="p-2 border"
                                name="NgayGiaoTra"
                                id="NgayGiaoTra"
                                value={moment(ngayGiaoTra).format(
                                  'YYYY-MM-DDTHH:mm',
                                )}
                                onChange={(e) => {
                                  setNgayGiaoTra(e.target.value)
                                }}
                              />
                            </div>
                          </>
                        ) : null}
                        {/* END: Hình thức trả */}

                        {/* START: Nội dung ghi chú */}
                        <div className="flex flex-col gap-2 col-span-2">
                          <p>Ghi chú:</p>
                          <DebounceInput
                            element="textarea"
                            className="border border-slate-400 focus:outline-slate-500 p-2"
                            placeholder="Nhập mô tả cập nhật/thay đổi"
                            minLength={2}
                            required={true}
                            debounceTimeout={300}
                            value={trangThaiGhiChu}
                            onChange={(e) => setTrangThaiGhiChu(e.target.value)}
                          />
                        </div>
                        {/* END: Nội dung ghi chú */}

                        {/* START: Cập nhật */}
                        <div className="col-span-1 flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              handleUpdateYeuCauGui(
                                dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_YeuCau_ID,
                                dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_TrangThai_ID,
                              )
                            }}
                            className="border p-2 rounded-xl font-medium bg-[#336699] text-white hover:opacity-70"
                          >
                            Cập nhật
                          </button>
                        </div>
                        {/* END: Cập nhật */}
                      </div>
                    </div>
                    {/* END: Cập nhật/Xử lý hồ sơ */}
                  </div>
                </div>
                {/* END: Thông tin hồ sơ */}

                {/* START: Các bước xử lý hồ sơ - Quy trình xử lý */}

                <div className="w-full">
                  <div className="flex flex-row items-center gap-2 bg-[#0484AC] text-white font-semibold px-3 py-1 rounded-md mb-4">
                    {showThongTinNguoiNop ? (
                      <FaCaretDown
                        className="text-white cursor-pointer"
                        onClick={handleShowThongTinNguoiNop}
                      />
                    ) : (
                      <FaCaretRight
                        className="text-white cursor-pointer"
                        onClick={handleShowThongTinNguoiNop}
                      />
                    )}
                    <h4>Quy trình xử lý</h4>
                  </div>
                  {/* Trạng thái hồ sơ */}
                  <p className="col-span-2 md:col-span-1 mb-4">
                    Trạng thái hồ sơ:{' '}
                    <span className="font-semibold text-red-600">
                      {dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_TrangThai_ID ===
                        -1 && 'Hồ sơ đã được hủy trả'}
                      {dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_TrangThai_ID !==
                        -1 &&
                        dataDetailYeuCau?.MC_TTHC_GV_TrangThai_TenTrangThai}
                    </span>
                  </p>
                  <ol className="relative m-10 text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400">
                    {listTrangThaiYeuCau.map((tt, index) => {
                      return (
                        <li className="mb-10 ms-10" key={index}>
                          <span className="absolute flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full -start-5 ring-10 ring-white border">
                            {tt?.MC_TTHC_GV_TrangThai_STT ===
                              dataDetailYeuCau?.MC_TTHC_GV_TrangThai_STT ||
                            dataDetailYeuCau?.MC_TTHC_GV_TrangThai_STT >
                              index ? (
                              <FaCheck className="text-green-600" />
                            ) : (
                              ''
                            )}
                          </span>
                          <div
                            className={clsx(
                              'flex flex-row items-center gap-2 px-5 rounded-2xl',
                              tt?.MC_TTHC_GV_TrangThai_STT ===
                                dataDetailYeuCau?.MC_TTHC_GV_TrangThai_STT ||
                                dataDetailYeuCau?.MC_TTHC_GV_TrangThai_STT >
                                  index
                                ? 'bg-[#0484AC] text-white '
                                : 'bg-gray-200 text-uneti-primary',
                            )}
                          >
                            {tt?.MC_TTHC_GV_TrangThai_STT ===
                              dataDetailYeuCau?.MC_TTHC_GV_TrangThai_STT ||
                            dataDetailYeuCau?.MC_TTHC_GV_TrangThai_STT >
                              index ? (
                              <FaCaretRight className="text-white cursor-pointer" />
                            ) : (
                              <FaCaretDown className="text-uneti-primary cursor-pointer" />
                            )}
                            <h3 className="font-medium leading-10">
                              Bước {index + 1}:{' '}
                              {tt.MC_TTHC_GV_TrangThai_TenTrangThai}
                            </h3>
                          </div>
                          <div
                            className={clsx(
                              dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_TrangThai_ID ===
                                -1
                                ? 'hidden'
                                : dataDetailYeuCau?.MC_TTHC_GV_TrangThai_STT ===
                                    tt.MC_TTHC_GV_TrangThai_STT
                                  ? 'hidden'
                                  : index + 1 ===
                                      dataDetailYeuCau?.MC_TTHC_GV_TrangThai_STT +
                                        1
                                    ? 'block'
                                    : 'hidden',
                            )}
                          >
                            <FormGuiEmailThongBaoXuLy
                              idGocTTHCGV={id}
                              dataDetailYeuCau={dataDetailYeuCau}
                              dataDetailTPHSYeuCau={dataDetailTPHSYeuCau}
                              currentStatusId={
                                dataDetailYeuCau?.MC_TTHC_GV_GuiYeuCau_TrangThai_ID
                              }
                              infoStatus={tt}
                              currentStep={tt.MC_TTHC_GV_TrangThai_STT}
                              stepHandle={index + 1}
                              listStatus={listTrangThaiYeuCau}
                              isDTPheDuyet={
                                tt.MC_TTHC_GV_TrangThai_DoiTuongXuLy
                              }
                              mucDoId={dataDetailYeuCau?.MC_TTHC_GV_IDMucDo}
                              contentEmail={trangThaiGhiChu}
                              onContentEmail={setTrangThaiGhiChu}
                              linkAttachedFile={linkFileTraKetQuaOnline}
                              dataAttachedFile={dataFileTraKetQuaKemTheo}
                              onLinkAttachedFile={setLinkFileTraKetQuaOnline}
                              onAttachedFile={setDataFileTraKetQuaKemTheo}
                              listDataCBNVPhanQuyen={listDataCBNVPhanQuyen}
                              onLoading={setLoading}
                            />
                          </div>
                        </li>
                      )
                    })}
                  </ol>
                </div>

                {/* END: Các bước xử lý hồ sơ - Quy trình xử lý */}

                {/* START: Xử lý hồ sơ */}
                <div className={clsx('mb-4')}>
                  <div className="flex flex-row items-center gap-2 bg-[#0484AC] text-white font-semibold px-3 py-1 rounded-md mb-4">
                    {!showQuaTrinhXuLy ? (
                      <FaCaretDown
                        className="text-white cursor-pointer"
                        onClick={handleShowQuaTrinhXuLyHoSo}
                      />
                    ) : (
                      <FaCaretRight
                        className="text-white cursor-pointer"
                        onClick={handleShowQuaTrinhXuLyHoSo}
                      />
                    )}
                    <h4>Chi tiết quá trình xử lý hồ sơ</h4>
                  </div>
                  <div className={clsx('w-full', showQuaTrinhXuLy && 'hidden')}>
                    <table className="relative w-full left-0 right-0 border mb-4">
                      <thead className="bg-[#336699] text-white">
                        <tr className="border">
                          <th className="border-r px-2">STT</th>
                          <th className="border-r px-2">Nhân sự xử lý</th>
                          <th className="border-r px-2">Hình thức xử lý</th>
                          <th className="border-r px-2">
                            Nội dung xử lý hồ sơ
                          </th>
                          <th className="border-r px-2">Tài liệu đính kèm</th>
                          <th className="border-r px-2">Thời gian xử lý</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedListQuyTrinhXuLy?.map((iQTXuLy, index) => {
                          return (
                            <tr className="border-b" key={index}>
                              <td className="border-r p-2 text-center">
                                {index + 1}
                              </td>
                              <td className="border-r p-2 text-center">
                                {iQTXuLy?.HoTen}
                              </td>
                              <td className="border-r p-2 text-center">
                                {iQTXuLy?.MC_TTHC_GV_TrangThai_TenTrangThai}
                              </td>
                              <td className="border-r p-2 text-center">
                                {iQTXuLy?.MC_TTHC_GV_GuiYeuCau_NoiDung_XuLy}
                              </td>
                              <td className="border-r p-2 text-center">
                                {iQTXuLy?.MC_TTHC_GV_GuiYeuCau_NoiTraKetQua}
                              </td>
                              <td className="p-2 text-center">
                                {moment(
                                  iQTXuLy?.MC_TTHC_GV_GuiYeuCau_DateEditor,
                                  'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
                                ).format('DD/MM/YYYY HH:mm:ss')}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                    <ReactPaginate
                      previousLabel={<FaCaretLeft color="#336699" size={32} />}
                      nextLabel={<FaCaretRight color="#336699" size={32} />}
                      pageCount={pageCount}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={handlePageChange}
                      containerClassName={'pagination'}
                      pageClassName={
                        'px-2 py-1 hover:text-white hover:font-semibold hover:bg-[#336699]'
                      }
                      activeClassName={
                        'px-2 py-1 text-white font-semibold bg-[#336699]'
                      }
                      className="w-full flex items-center justify-end gap-1"
                    />
                  </div>
                </div>
                {/* END: Xử lý hồ sơ */}
              </div>
            </div>
          </Suspense>
        )}
      </div>
    )
  } else {
    return (
      <>
        {loading ? (
          <div className="relative left-0 right-0 w-full flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          <p className="px-3 py-1 rounded-md bg-white text-red-500 text-center font-semibold">
            Không tìm thấy dữ liệu yêu cầu hợp lệ.
          </p>
        )}
      </>
    )
  }
}

export default ChiTietHoSoYeuCau
