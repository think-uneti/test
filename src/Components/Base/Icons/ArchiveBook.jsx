import { useState } from 'react'
import { useEffect } from 'react'

import './ArchiveBook.scss'

export default function ArchiveBook() {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    setIsActive(true)
  }, [])

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={isActive ? 'active' : null}
    >
      <path
        d="M3 7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V10.95"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="archive-book-svg-elem-1"
      ></path>
      <path
        d="M15.5 5.98999V9.85999C15.5 10.3 14.98 10.52 14.66 10.23L12.34 8.09003C12.15 7.91003 11.85 7.91003 11.66 8.09003L9.34003 10.23C9.02003 10.52 8.5 10.3 8.5 9.85999V2H15.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="archive-book-svg-elem-2"
      ></path>
      <path
        d="M13.25 14H17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="archive-book-svg-elem-3"
      ></path>
      <path
        d="M9 18H17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="archive-book-svg-elem-4"
      ></path>
    </svg>
  )
}
