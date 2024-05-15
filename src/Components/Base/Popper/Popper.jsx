import { useRef } from 'react'
import { popperCtx } from './token'
import {
  flip as fFlip,
  shift as fShift,
  arrow as fArrow,
  offset as fOffset,
  useFloating,
} from '@floating-ui/react'

export const Popper = ({ children, ...props }) => {
  const {
    isOpen = false,
    placement = 'bottom',
    flip = true,
    shift = false,
    arrow = false,
    offset = 0,
  } = props

  const triggerRef = useRef()
  const contentRef = useRef()
  const arrowRef = useRef()

  const {
    refs,
    floatingStyles,
    context: floatingCtx,
    middlewareData,
  } = useFloating({
    middleware: [
      flip && fFlip(),
      shift && fShift(),
      arrow &&
        fArrow({
          element: arrowRef,
        }),
      offset && fOffset(0),
    ],
    placement,
    strategy: 'absolute',
    open: isOpen,
    elements: {
      floating: contentRef,
      reference: triggerRef,
    },
  })

  return (
    <popperCtx.Provider
      value={{
        placement,
        triggerRef,
        contentRef,
        arrowRef,
        floatingCtx,
        floatingStyles,
        middlewareData,
        refs,
      }}
    >
      {children}
    </popperCtx.Provider>
  )
}
