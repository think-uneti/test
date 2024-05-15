import { useContext } from "react"
import { popperCtx } from "./token"

export const PopperTrigger = ({ children, ...props }) => {
  console.log(props)
  const popperProvider = useContext(popperCtx)

  console.log(popperProvider)
  return <div>{children}</div>
}
