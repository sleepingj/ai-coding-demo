import { useState, useEffect } from 'react'
import './App.css'
import {initEah} from './initEah'

function PageRender({config}) {
  const [Page, setPage] = useState<React.ComponentType<any> | null>(null)

  useEffect(() => {
    initEah()
      .then(({ Page }) => {
        setPage(() => Page as any)
      })
      .catch((error) => {
        console.error('Failed to initialize EAH CDN:', error)
      })
  }, [])

  return (
    <>
      {Page && <Page schema={config} />}
    </>
  )
}

export default PageRender
