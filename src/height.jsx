import { useEffect, useRef } from 'react'

const Height = ({ children, onHeight }) => {
  const ref = useRef(null)

  useEffect(() => {
    const intervalId = setInterval(() => {
      onHeight(ref.current.clientHeight)
    }, 100)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div style={{ width: '100%' }} ref={ref}>
      {children}
    </div>
  )
}

export default Height