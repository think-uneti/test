import { useContext } from 'react'
import { popperCtx } from './token'
import { FloatingArrow } from '@floating-ui/react'

export const PopperContent = ({ children, ...props }) => {
  console.log(props)
  const popperProvider = useContext(popperCtx)

  console.log(popperProvider)
  return (
    <div>
      <FloatingArrow ref={popperProvider.arrowRef} context={popperProvider.floatingCtx} />

      {children}
    </div>
  )
}
