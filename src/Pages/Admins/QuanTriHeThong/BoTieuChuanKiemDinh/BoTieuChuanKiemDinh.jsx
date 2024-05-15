import TCKiemDinhCSGD from '@/Components/KiemDinhChatLuong/QuanTriHeThong/BoTieuChuanKiemDinh/TCKiemDinhCSGD'
import TCKiemDinhCTDT from '@/Components/KiemDinhChatLuong/QuanTriHeThong/BoTieuChuanKiemDinh/TCKiemDinhCTDT'
import { useNamespace } from '@/Services/Hooks'
import { Box, Tab, Tabs } from '@mui/material'
import { useState } from 'react'

export const BoTieuChuanKiemDinh = () => {
  const ns = useNamespace('kiem-dinh-chat-luong')

  const [tab, setTab] = useState(0)

  const handleChangeTab = (event, tab) => {
    setTab(tab)
  }

  return (
    <div className="box">
      <Tabs
        value={tab}
        onChange={handleChangeTab}
        variant="scrollable"
        aria-label="tab cau hinh nhiem vu"
        className="border-b border-gray-200"
      >
        <Tab
          label="Bộ tiêu chí kiểm định CTĐT"
          className={ns.em('tabs', 'tab')}
          id={ns.m('tab-0')}
        />
        <Tab
          label="Bộ tiêu chí kiểm định CSGD"
          className={ns.em('tabs', 'tab')}
          id={ns.m('tab-1')}
        />
      </Tabs>

      <Box sx={{ p: 2 }}>
        <TCKiemDinhCTDT tab={tab} index={0} />
        <TCKiemDinhCSGD tab={tab} index={1} />
      </Box>
    </div>
  )
}

export default BoTieuChuanKiemDinh
