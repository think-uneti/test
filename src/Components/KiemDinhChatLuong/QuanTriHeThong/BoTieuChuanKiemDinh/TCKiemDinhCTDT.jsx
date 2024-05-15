import { keys } from 'lodash-unified'
import { Checkbox, Switch } from '@mui/material'
import { useState } from 'react'
import Icon from '@/Components/Base/Icon/Icon'
import { BiChevronDown } from 'react-icons/bi'

const tc = [
  {
    Id: 1,
    Ma: 'Tiêu chuẩn 1',
    NoiDung: 'Mục tiêu và chuẩn đầu ra của chương trình đào tạo',
    children: [
      {
        Id: 2,
        Ma: 'Tiêu chí 1.1',
        NoiDung:
          'Mục tiêu của chương trình đào tạo được xác định rõ ràng, phù hợp với sứ mạng và tầm nhìn của cơ sở giáo dục đại học, phù hợp mới Mục tiêu của giáo dục đại học quy định tại Luật giáo dục đại học.',
      },
      {
        Id: 3,
        Ma: 'Tiêu chí 1.2',
        NoiDung:
          'Chuẩn đầu ra của chương trình đào tạo phản ánh được yêu cầu của các bên liên quan, được định kỳ rà soát, Điều chỉnh và được công bố công khai',
      },
    ],
  },
  {
    Id: 4,
    Ma: 'Tiêu chuẩn 2',
    NoiDung: 'Bản mô tả chương trình đào tạo',
    children: [
      {
        Id: 5,
        Ma: 'Tiêu chí 2.1',
        NoiDung: 'Bản mô tả chương trình đào tạo đầy đủ thông tin và cập nhật.',
      },
      {
        Id: 6,
        Ma: 'Tiêu chí 2.2',
        NoiDung: 'Đề cương các học phần đầy đủ thông tin và cập nhật.',
      },
    ],
  },
]

export default function TCKiemDinhCTDT(props) {
  const { tab, index } = props

  const [roleActive, setRoleActive] = useState(0)

  return (
    <div hidden={index !== tab}>
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <span>Bộ tiêu chí</span>
          <select className="base-input">
            <option>Bộ GD&ĐT</option>
          </select>
        </div>
        <div className="flex items-center">
          <span>Sử dụng</span>
          <Checkbox checked />
        </div>
      </div>
      <div className="flex gap-[30px] mx-[-15px] mt-3">
        <table className="table w-full border">
          <thead>
            <th className="th w-[250px]">Mã tiêu chuẩn/tiêu chí</th>
            <th className="th">Nội dung</th>
          </thead>

          <tbody>
            {tc.map((e, i) => (
              <>
                <tr key={i} className="tr">
                  <td className="td">
                    <div className="flex items-center">
                      <Icon>
                        <BiChevronDown />
                      </Icon>
                      <span className="font-bold">{e.Ma}</span>
                    </div>
                  </td>
                  <td className="td font-bold">{e.NoiDung}</td>
                </tr>

                {e.children.length > 0 &&
                  e.children.map((child, iC) => (
                    <tr className="tr" key={`${i}-${iC}`}>
                      <td className="td pl-10">{child.Ma}</td>
                      <td className="td">{child.NoiDung}</td>
                    </tr>
                  ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
