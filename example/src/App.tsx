import React, { useState, useEffect } from 'react'

import { BookViewer } from 'book-viewer'
import 'book-viewer/dist/index.css'

const App = () => {
  const [imgs, setImgs] = useState<string[]>([])

  useEffect(() => {
    const getImgs = async () => {
      let res: any = await fetch('https://picsum.photos/v2/list')
      res = await res.json()

      setImgs(res.map((item: any) => item.download_url))
    }

    getImgs()
  }, [])

  return <BookViewer src={imgs} />
}

export default App
