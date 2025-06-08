import { useState } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'
import { postEvent } from '@telegram-apps/sdk'

const Body = styled.div`
  width: 100vh;
  height: 100vw;
`

const Head = styled.div`
  width: 100%;
  height: 50px;
  background: #fa0;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 999999;
  opacity: 0;
`

const Nav = styled.div`
  width: 100%;
  height: 50px;
  background: #fa0;
  position: absolute;
  bottom: 0px;
  left: 0px;
  z-index: 999999;
  opacity: 0;
`

const Card = ({ setIndex, index, drag, frontCard, width, height }) => {
  const [exitX, setExitX] = useState(0)

  const x = useMotionValue(0)
      , scale = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5])
      , rotate = useTransform(x, [-150, 0, 150], [-20, 0, 25], {
          clamp: false
        })

  const xInput = [-10, 0, 10]

  const color = useTransform(x, xInput, [
      "rgb(211, 9, 225)",
      "rgb(68, 0, 255)",
      "rgb(3, 209, 0)",
  ])
  
  const tickPath = useTransform(x, [1, 10], [0, 1])
  const crossPathA = useTransform(x, [-1, -5.5], [0, 1])
  const crossPathB = useTransform(x, [-5.0, -10], [0, 1])

  const variantsFrontCard = {
          animate: { scale: 1, y: 0, opacity: 1 },
          exit: (custom) => ({
            x: custom * 10,
            y: Math.abs(custom * 5),
            opacity: 0,
            scale: 0.2,
            transition: { duration: 5 }
          })
        }
      , variantsBackCard = {
          initial: { scale: 0, y: -10, opacity: 0 },
          animate: { scale: 0.98, y: 10, opacity: 1 }
        }
      , variantsBackCard2 = {
          initial: { scale: 0, y: -10, opacity: 0 },
          animate: { scale: 0.95, y: 20, opacity: 1 }
        }

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -100) {
      setExitX(-250)
      setIndex(index + 1)
    }
    if (info.offset.x > 100) {
      setExitX(250)
      setIndex(index + 1)
      window.location.href = 'https://t.me/prohetamine'
      setTimeout(() => {
        postEvent('web_app_close')
      }, 5000)
    }
  }

  return (
    <motion.div
      style={{
        width,
        height: height - 16, 
        position: 'absolute',
        top: 20,
        x,
        rotate,
        originY: 0.8,
        cursor: 'grab'
      }}
      whileTap={{ cursor: 'grabbing' }}
      drag={drag}
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      onDragEnd={handleDragEnd}
      variants={frontCard === 0 ? variantsFrontCard : frontCard === 1 ? variantsBackCard : variantsBackCard2}
      initial='initial'
      animate='animate'
      exit='exit'
      custom={exitX}
      transition={
        frontCard === 0
          ? { type: 'spring', stiffness: 300, damping: 20 }
          : { scale: { duration: 0.2 }, opacity: { duration: 0.4 } }
      }
    >
      <motion.div
        style={{
          width,
          height: height - 16,
          color: '#000',
          scale,
          borderRadius: 30,
          backgroundColor: '#fff',
          boxShadow: (frontCard === 0 || frontCard === 1) ? '0px 2px 10px 0px rgba(108, 108, 108, 0.22)' : '0px 0px 0px 1px #ddd',
          textWrap: 'wrap'
        }}
      >
        <motion.div>
            <svg className="progress-icon" viewBox="0 0 50 50">
                <motion.path
                    fill="none"
                    strokeWidth="2"
                    stroke={color}
                    d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
                    style={{
                        x: 5,
                        y: 5,
                    }}
                />
                <motion.path
                    id="tick"
                    fill="none"
                    strokeWidth="2"
                    stroke={color}
                    d="M14,26 L 22,33 L 35,16"
                    strokeDasharray="0 1"
                    style={{ pathLength: tickPath }}
                />
                <motion.path
                    fill="none"
                    strokeWidth="2"
                    stroke={color}
                    d="M17,17 L33,33"
                    strokeDasharray="0 1"
                    style={{ pathLength: crossPathA }}
                />
                <motion.path
                    id="cross"
                    fill="none"
                    strokeWidth="2"
                    stroke={color}
                    d="M33,17 L17,33"
                    strokeDasharray="0 1"
                    style={{ pathLength: crossPathB }}
                />
            </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

const App = () => {
  const [index, setIndex] = useState(0)

  const width = window.innerWidth - 50
      , height = window.innerHeight - 100

  return (
      <motion.div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', position: "relative" }}>
        {/* <Head></Head> */}
        <AnimatePresence>
          <Card 
            width={width}
            height={height}
            index={index + 2} 
            key={index + 2} 
            frontCard={2} 
          />
          <Card 
            width={width}
            height={height}
            index={index + 1} 
            key={index + 1}
            frontCard={1} 
          />
          <Card
            width={width}
            height={height}
            key={index}
            frontCard={0}
            index={index}
            setIndex={setIndex}
            drag="x"
          />
        </AnimatePresence>
        {/* <Nav></Nav> */}
      </motion.div>
  )
}

export default App