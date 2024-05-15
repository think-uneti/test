import { useEffect, useState } from 'react'
import {
  NguonTiepNhan_WEB,
  homeTaiSan,
  listCoSo,
  listDiaDiem,
} from '@/Services/Static/dataStatic.js'

import { DataSinhVien } from '@/Services/Utils/dataSinhVien.js'
import { DataCanBoGV } from '@/Services/Utils/dataCanBoGV.js'
import {
  getDanhSachPhong,
  getDanhSachSuCoByHoTroThietBi,
  getDanhSachTaiSan,
  getDanhSachTang,
  getDanhSachToaNha,
  postYeuCauBaoHongTaiSan,
} from '@/Apis/HoTroThietBi/apiTaiSan.js'
import BaoHongTaiSanView from './BaoHongTaiSanView'
import Swal from 'sweetalert2'
import { required } from '@/Services/Validators/required'
import { dayjs } from '@/Services/Utils/dayjs'

const BaoHongTaiSan = () => {
  const [loading, setLoading] = useState(true)
  const { listCanBoHoTro, listHotlines, listAppSupport } = homeTaiSan

  const dataSinhVien = DataSinhVien()
  const dataCBGV = DataCanBoGV()

  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedTaiSan, setSelectedTaiSan] = useState([])
  const [hinhThucBaoHong, setHinhThucBaoHong] = useState('')
  const [moTaSuCo, setMoTaSuCo] = useState('')
  const [idPhong, setIdPhong] = useState('')
  const [listTaiSan, setListTaiSan] = useState([])
  const [listToaNha, setListToaNha] = useState([])
  const [listTang, setListTang] = useState([])
  const [listPhong, setListPhong] = useState([])

  const [searchPhong, setSearchPhong] = useState('')
  const [selectedPhong, setSelectedPhong] = useState(null)
  const [openSelectPhong, setOpenSelectPhong] = useState(false)

  const [listSuCo, setListSuCo] = useState([])
  const [tenSuCo, setTenSuCo] = useState([])

  const [dataViTri, setDataViTri] = useState({
    DT_QLP_Phong_CoSo: ' ',
    DT_QLP_Phong_DiaDiem: ' ',
    DT_QLP_Phong_ToaNha: ' ',
    DT_QLP_Phong_Tang: ' ',
    DT_QLP_Phong_Phong: ' ',
  })

  const [dataTaiSan, setDataTaiSan] = useState(null)
  // event handlers
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected)
  }

  const handleShowModal = () => {
    setShowModal(!showModal)
  }

  const handleSelectHinhThucBaoHong = (e) => {
    setHinhThucBaoHong(e.target.id)
  }

  const handleSelectTaiSan = (e, taiSan) => {
    setSelectedTaiSan(() => taiSan)
  }

  const handleChangeValue = (e) => {
    const { id, value } = e.target
    if (value === '') {
      setDataViTri({
        DT_QLP_Phong_CoSo: ' ',
        DT_QLP_Phong_DiaDiem: ' ',
        DT_QLP_Phong_ToaNha: ' ',
        DT_QLP_Phong_Tang: ' ',
        DT_QLP_Phong_Phong: ' ',
      })
    }

    setDataViTri({ ...dataViTri, [id]: value })
    if (id === 'DT_QLP_Phong_Phong') {
      setIdPhong(value)
    }
  }

  const validateSubmitData = () => {
    const {
      DT_QLP_Phong_CoSo,
      DT_QLP_Phong_DiaDiem,
      DT_QLP_Phong_ToaNha,
      DT_QLP_Phong_Phong,
    } = dataViTri
    return [
      required(hinhThucBaoHong, 'Vui lòng chọn hình thức báo hỏng!'),
      required(DT_QLP_Phong_CoSo, 'Vui lòng chọn cơ sở!'),
      required(DT_QLP_Phong_DiaDiem, 'Vui lòng chọn địa điểm!'),
      required(DT_QLP_Phong_ToaNha, 'Vui lòng chọn tòa nhà!'),
      required(DT_QLP_Phong_Phong, 'Vui lòng chọn phòng!'),
      required(tenSuCo, 'Vui lòng chọn tên sự cố!'),
      required(moTaSuCo.trim(), 'Vui lòng nhập mô tả sự cố!'),
    ].every((e) => e === true)
  }

  const handleSubmit = async () => {
    let currentTime = dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
    if (!validateSubmitData()) return

    if (hinhThucBaoHong === '2' && selectedTaiSan.length === 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Vui lòng chọn 1 tài sản cần báo hỏng!',
      })
    }

    const dataBaoHong = {
      DT_QLTS_TS_HoTroThietBi_IDTaiSan: selectedTaiSan?.DT_QLTS_TS_ID,
      DT_QLTS_TS_HoTroThietBi_BaoHong_IDPhong: idPhong,
      DT_QLTS_TS_HoTroThietBi_BaoHong_MaNhanSu:
        dataCBGV?.MaNhanSu ?? dataSinhVien?.MaSinhVien,
      DT_QLTS_TS_HoTroThietBi_BaoHong_TenSuCo: tenSuCo.join('; '),
      DT_QLTS_TS_HoTroThietBi_BaoHong_NgayGui: currentTime,
      DT_QLTS_TS_HoTroThietBi_BaoHong_MoTa: moTaSuCo,
      DT_QLTS_TS_HoTroThietBi_XuLy_MaNhanSu: '',
      DT_QLTS_TS_HoTroThietBi_XuLy_NgayXuLy: '',
      DT_QLTS_TS_HoTroThietBi_XuLy_GuiMail: 'null',
      DT_QLTS_TS_HoTroThietBi_XacNhan_HoanThanh: '',
      DT_QLTS_TS_HoTroThietBi_XacNhan_NgayXacNhan: '',
      DT_QLTS_TS_HoTroThietBi_NguonTiepNhan: NguonTiepNhan_WEB,
    }

    try {
      const res = await postYeuCauBaoHongTaiSan(dataBaoHong)
      if (res === true) {
        return Swal.fire({
          icon: 'success',
          title: 'Gửi yêu cầu báo hỏng thành công!',
          text: `Ban đã báo hỏng thành công!`,
        })
      } else {
        return Swal.fire({
          icon: 'error',
          title: 'Có lỗi xảy ra!',
          text: 'Vui lòng liên hệ quản trị phần mềm để khắc phục sự cố!',
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  // fetch data
  const getListTaiSan = async () => {
    getDanhSachTaiSan(idPhong.toString())
      .then((res) => {
        setListTaiSan(res)
        setLoading(false)
      })
      .catch((err) => {
        console.log([err])
        setLoading(false)
        setListTaiSan([])
      })
  }

  const getListToaNha = async () => {
    const { DT_QLP_Phong_CoSo, DT_QLP_Phong_DiaDiem } = dataViTri
    getDanhSachToaNha({ DT_QLP_Phong_CoSo, DT_QLP_Phong_DiaDiem })
      .then((res) => {
        setLoading(false)
        setListToaNha(res)
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      })
  }

  const getListTang = async () => {
    const { DT_QLP_Phong_Phong, DT_QLP_Phong_Tang, ...rest } = dataViTri
    getDanhSachTang(rest)
      .then((res) => {
        setLoading(false)
        setListTang(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const getListPhong = async () => {
    setLoading(true)
    const { DT_QLP_Phong_Phong, ...rest } = dataViTri
    try {
      getDanhSachPhong(rest)
        .then((res) => {
          setLoading(false)
          setListPhong(res)
        })
        .catch((err) => {
          setLoading(false)
          console.log(err)
        })
    } catch (error) {
      setLoading(false)
      console.log(err)
    }
  }

  const getListDanhSachSuCo = async () => {
    setLoading(true)
    getDanhSachSuCoByHoTroThietBi()
      .then((res) => {
        setListSuCo(res)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (idPhong && idPhong.toString().trim() !== '') {
      getListTaiSan()
    }

    return () => {
      setListTaiSan([])
    }
  }, [idPhong])

  useEffect(() => {
    getListToaNha()
    getListTang()
    getListPhong()
  }, [dataViTri])

  useEffect(() => {
    getListDanhSachSuCo()

    return () => {
      setListSuCo([])
    }
  }, [])

  return (
    <BaoHongTaiSanView
      loading={loading}
      dataViTri={dataViTri}
      listCoSo={listCoSo}
      listDiaDiem={listDiaDiem}
      listToaNha={listToaNha}
      listTang={listTang}
      listPhong={listPhong}
      listTaiSan={listTaiSan}
      showModal={showModal}
      taiSan={selectedTaiSan}
      hinhThucBaoHong={hinhThucBaoHong}
      listSuCo={listSuCo}
      tenSuCo={tenSuCo}
      moTaSuCo={moTaSuCo}
      dataTaiSan={dataTaiSan}
      searchPhong={searchPhong}
      selectedPhong={selectedPhong}
      openSelectPhong={openSelectPhong}
      onSelectedPhong={setSelectedPhong}
      onSetSearchPhong={setSearchPhong}
      onOpenSelectPhong={setOpenSelectPhong}
      onSetDataViTri={setDataViTri}
      onSetIdPhong={setIdPhong}
      onShowModal={handleShowModal}
      onChangeValue={handleChangeValue}
      onSelectTaiSan={handleSelectTaiSan}
      onSelectHinhThuc={handleSelectHinhThucBaoHong}
      onReceiveMoTaSuCo={setMoTaSuCo}
      onSubmit={handleSubmit}
      onSetTenSuCo={setTenSuCo}
      onSetDataTaiSan={setDataTaiSan}
    />
  )
}

export default BaoHongTaiSan
