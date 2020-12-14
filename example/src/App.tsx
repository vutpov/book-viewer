import React, { useState, useEffect } from 'react'

import { BookViewer } from 'book-viewer'
import 'book-viewer/dist/index.css'

const App = () => {
  const [imgs, setImgs] = useState<string[]>([])

  useEffect(() => {
    const getImgs = async () => {
      let res: any = await fetch('https://picsum.photos/v2/list')
      res = await res.json()
      const imgUrls = res.map((item: any) => item.download_url)

      setImgs(imgUrls)
    }

    getImgs()
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <BookViewer
        src={imgs}
        onChange={(args) => {
          console.log(args)
        }}
      />
    </div>
  )
}

export default App
