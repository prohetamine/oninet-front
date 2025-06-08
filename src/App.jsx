import { useEffect, useState } from 'react'
import { motion, motionValue, animate, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'
import { postEvent } from '@telegram-apps/sdk'
import axios from 'axios'
import Height from './height.jsx'
import like from './assets/like.svg'
import dislike from './assets/dislike.svg'
import warn from './assets/warn.svg'
import hello from './assets/hello.svg'
import getCityById from './get-city-by-id.js'

const Navigation = styled.div`
  width: 100%;
  height: 80px;
  position: absolute;
  bottom: 15px;
  left: 0px;
  z-index: 999999;
  opacity: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
`

const IconButton = styled.div`
  background-image: url("${props => props.src}");
  background-size: cover;
  background-position: center center;
  -webkit-filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.1));
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.1));
`

const ButtonBig = styled(motion.div)`
  width: 65px;
  height: 65px;
  background: #fff;
  color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  cursor: pointer;
  user-select: none;
  box-shadow: 0px 2px 10px 0px rgba(108, 108, 108, 0.22);
`

const ButtonSmall = styled(motion.div)`
  width: 55px;
  height: 55px;
  background: #fff;
  color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  cursor: pointer;
  user-select: none;
  box-shadow: 0px 2px 10px 0px rgba(108, 108, 108, 0.22);
`

const CardWrapper = styled(motion.div)`
  overflow: hidden;
`

const CardPhotoWrapper = styled.div`

`

const Photo = styled.div`
  background-size: cover;
  background-position: center center;
`

const Like = styled(motion.div)`
  opacity: 1;
  color: #13b08c;
  border-radius: 15px;
  border: 4px solid #13b08c;
  font-size: 25px;
  padding: 15px 20px;
  z-index: 99999;
  position: absolute;
  -webkit-filter: drop-shadow(0px 0px 20px #666666ff);
  filter: drop-shadow(0px 0px 20px #666666ff);
  top: 60px;
  right: 40px;
  transform: rotateZ(30deg);
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: normal;
`

const Dislike = styled(motion.div)`
  opacity: 1;
  border: 4px solid #f10000;
  color: #f10000;
  border-radius: 15px;
  font-size: 25px;
  padding: 15px 20px;
  z-index: 99999;
  position: absolute;
  -webkit-filter: drop-shadow(0px 0px 20px #666666ff);
  filter: drop-shadow(0px 0px 20px #666666ff);
  top: 60px;
  left: 40px;
  transform: rotateZ(-30deg);
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 800;
  font-style: normal;
`

const OverflowShadow = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  overflow: scroll;
  border-radius: 30px 30px 30px 30px;
  display: flex;
  align-items: flex-end;
`

const BioText = styled(motion.div)`
  width: 100%;
  padding: 30px 20px 1200px 20px;
  color: #eee;
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
  box-sizing: border-box;
  width: 100%;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.52) 99%,rgba(0, 0, 0, 0) 100%);
`

const Card = ({ setIndex, index, drag, frontCard, width, height, user }) => {
  const [exitX, setExitX] = useState(0)
  const [heightBio, setHeightBio] = useState(0)

  const x = useMotionValue(0)
      , scale = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5])
      , rotate = useTransform(x, [-150, 0, 150], [-20, 0, 25], {
          clamp: false
        })

  const crossPathA = useTransform(x, [-5, -30], [0, 1])
  const crossPathB = useTransform(x, [5, 30], [0, 1])

  const variantsFrontCard = {
          animate: { scale: 1, y: 2, opacity: 1 },
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
          animate: { scale: 0.98, y: 0, opacity: 1 }
        }

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -100) {
      setExitX(-250)
      setIndex(index + 1)
    }
    if (info.offset.x > 100) {
      setExitX(250)
      setIndex(index + 1)
      window.location.href = `https://t.me/${user.system_username}`
      setTimeout(() => {
        postEvent('web_app_close')
      }, 5000)
    }
  }

  window.swipeLeft = () => {
    const a = motionValue(0)
    a.on('change', data => {
      x.updateAndNotify(-data)
      if (data === 250) {
        setExitX(-250)
        setIndex(index + 1)
      }
    })
    animate(a, 250)
  }

  window.swipeRight = () => {
    const a = motionValue(0)
    a.on('change', data => {
      x.updateAndNotify(data)
      if (data === 250) {
        setExitX(250)
        setIndex(index + 1)
      }
    })
    animate(a, 250)
  }

  const profile_generate = user => {
    let text = ''

    let nm = (user?.etc_testBottomInternetRate[0] > user?.etc_testBottomInternetRate[1]) ? `Нижнометр: ${`${((rate => rate > 100 ? 100 : rate < 0 ? 0 : rate)((100 / (user?.etc_testBottomInternetRate[0] + user?.etc_testBottomInternetRate[1])) * user?.etc_testBottomInternetRate[0] || 0)).toFixed(1)}`}% 📊` : ''

    text += user?.location !== '999|666' ? `<b>${getCityById(user?.location).title} ${getCityById(user?.location).flag} 📍</b><br />` : `<b>Анонимный 🏴‍☠️ 📍</b><br />`
    text += user?.location !== '999|666' ?  user?.privacyCity === 0 ? '' : user?.privacyCity === 1 ? `Мой и ближайшие города 🌇<br />` : `Только мой город 🏡<br />` : ''
    text += `<br />${user?.text}${nm ? `<br /><br />` : ''}`
    text += nm
    
    return text
  }

  return (
    <motion.div
      style={{
        width,
        height: height - 16, 
        position: 'absolute',
        top: 5,
        x,
        rotate,
        originY: 0.8,
        cursor: 'grab'
      }}
      whileTap={{ cursor: 'grabbing' }}
      drag={drag}
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      onDragEnd={handleDragEnd}
      variants={frontCard === 0 ? variantsFrontCard : variantsBackCard}
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
      <CardWrapper
        style={{
          width,
          height: height - 16,
          color: '#000',
          scale,
          borderRadius: 30,
          backgroundColor: '#fff',
          boxShadow: frontCard === 0 ? '0px 2px 10px 0px rgba(108, 108, 108, 0.22)' : '0px 0px 0px 1px #ddd',
          textWrap: 'wrap'
        }}
      >
        {
          user 
            ? (
              <>
                <CardPhotoWrapper>
                  <Photo style={{ backgroundImage: `url(${user?.media[0]})`, width: '100%', height: height - 16 }}></Photo>
                </CardPhotoWrapper>
                <Like style={{ opacity: crossPathB }}>LIKE</Like>
                <Dislike style={{ opacity: crossPathA }}>DISLIKE</Dislike>
                <OverflowShadow>
                  <Height onHeight={data => setHeightBio(data)}>
                    <BioText 
                      drag={'y'}
                      initial={{ y: 0 }}
                      animate={{ y: heightBio > 140 ? heightBio - 140 : 0 }}
                      dragConstraints={{ top: 1170, bottom: heightBio - 80 }}
                      dangerouslySetInnerHTML={{ __html: profile_generate(user) }}
                    ></BioText>
                  </Height>
                </OverflowShadow>
              </>
            ) 
            : (
              null
            )
        }
      </CardWrapper>
    </motion.div>
  )
}

const App = () => {
  const [index, setIndex] = useState(0)

  const [users, setUsers] = useState({})

  useEffect(() => {
    const timeId = setTimeout(() => {
      axios.get(`http://localhost:8989/user?offset=${index}`)
        .then(({ data }) => {
          const users = data.reduce((ctx, elem, i) => {
            ctx[index + i] = elem
            return ctx
          }, {})

          setUsers(u => ({ ...u, ...users }))
        })
    }, 100)

    return () => clearTimeout(timeId)
  }, [index])

  const width = window.innerWidth - 50
      , height = window.innerHeight - 100

  return (
      <motion.div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', position: 'relative' }}>
        <AnimatePresence>
          <Card 
            width={width}
            height={height}
            index={index + 1} 
            key={index + 1}
            frontCard={1} 
            user={users[index + 1]}
          />
          <Card
            width={width}
            height={height}
            key={index}
            frontCard={0}
            index={index}
            setIndex={setIndex}
            drag="x"
            user={users[index]}
          />
        </AnimatePresence>
        <Navigation>
          <ButtonSmall 
            onClick={() => {
              window.swipeLeft()
              window.location.href = `https://t.me/oninetbot?start=r_${users[index]?.system_callHashId}`
            }} 
            whileTap={{ scale: 0.9 }}
          >
            <IconButton src={warn} style={{ width: '22px', height: '22px' }} />
          </ButtonSmall>
          <ButtonBig 
            onClick={() => {
              window.swipeLeft()
            }} 
            whileTap={{ scale: 0.9 }}
          >
            <IconButton src={dislike} style={{ width: '32px', height: '32px' }} />
          </ButtonBig>
          <ButtonBig 
            onClick={() => {
              window.swipeRight()
              window.location.href = `https://t.me/${users[index]?.system_username}`
            }} 
            whileTap={{ scale: 0.9 }}
          >
            <IconButton src={like} style={{ width: '32px', height: '32px' }} />
          </ButtonBig>
          <ButtonSmall 
            onClick={() => {
              window.swipeRight()
              // ..
            }}
            whileTap={{ scale: 0.9 }}
          >
            <IconButton src={hello} style={{ width: '22px', height: '22px' }} />
          </ButtonSmall>
        </Navigation>
      </motion.div>
  )
}

export default App