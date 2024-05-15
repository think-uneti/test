import { useState } from 'react'
import { useEffect } from 'react'

import './AudioPlay.scss'

export default function IconAudioPlay() {
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
        d="M15 7.41003C15 4.43003 12.93 3.29003 10.41 4.87003L7.49 6.70003C7.17 6.89003 6.8 7.00003 6.43 7.00003H5C3 7.00003 2 8.00003 2 10V14C2 16 3 17 5 17H6.43C6.8 17 7.17 17.11 7.49 17.3L10.41 19.13C12.93 20.71 15 19.56 15 16.59V11.47"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="audio-play-svg-elem-1"
      ></path>
      <path
        d="M18 8C19.78 10.37 19.78 13.63 18 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="audio-play-svg-elem-2"
      ></path>
      <path
        d="M19.8301 18.5C21.2801 16.57 22.0001 14.29 22.0001 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="audio-play-svg-elem-3"
      ></path>
      <path
        d="M19.8301 5.5C20.4201 6.28 20.8801 7.12 21.2301 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="audio-play-svg-elem-4"
      ></path>
    </svg>
  )
}
