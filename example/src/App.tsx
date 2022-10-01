import React, { useState, useEffect, useRef } from 'react'
import 'rc-slider/assets/index.css'
//@ts-ignore
import { BookViewer, FlipBook } from 'book-viewer'
import 'book-viewer/dist/index.css'
import { useFullscreen } from 'ahooks'

const App = () => {
  const [imgs, setImgs] = useState<string[]>([])

  useEffect(() => {
    const getImgs = async () => {
      const imgUrls = Array(30)
        .fill(0)
        .map((_item: any, index) => {
          return `https://picsum.photos/id/${index + 1}/800`
        })

      setImgs(imgUrls)
    }

    getImgs()
  }, [])

  const ref = useRef<any>()
  const [isFullscreen, { setFull }] = useFullscreen(ref)

  useEffect(() => {
    if (isFullscreen) {
      const el = document.getElementById('__book-viewer-btn-next')!!
      el.focus()
    }
  }, [isFullscreen])

  return (
    <>
      <button
        onClick={() => {
          setFull()
        }}
      >
        open
      </button>

      {/* <BookViewer
        containerStyle={{ display: isFullscreen ? 'block' : 'none' }}
        containerRef={ref}
        id={'view'}
        src={imgs}
        onChange={(args) => {
          console.log(args)
        }}
        prefixControl={
          <div
            style={{
              width: '100%'
            }}
          >
            prefix
          </div>
        }
        suffixControl={
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>1</div>
            <div>hello</div>
          </div>
        }
      /> */}

      <FlipBook
        containerStyle={{ display: isFullscreen ? 'block' : 'none' }}
        containerRef={ref}
        id={'view'}
        src={imgs}
        prefixControl={
          <div
            style={{
              width: '100%'
            }}
          >
            prefix
          </div>
        }
        suffixControl={
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>1</div>
            <div>hello</div>
          </div>
        }
      />
    </>
  )
}

export default App
