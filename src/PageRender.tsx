import { useState, useEffect } from 'react'
import './App.css'
import {initEah} from './initEah'

function PageRender({config}) {
  const [Page, setPage] = useState<React.ComponentType<any> | null>(null)
  const [Lister ,setLister] = useState<React.ComponentType<any> | null>(null)

  useEffect(() => {
    initEah()
      .then(({ Page, Lister }) => {
        setPage(() => Page as any)
        setLister(() => Lister as any)
      })
      .catch((error) => {
        console.error('Failed to initialize EAH CDN:', error)
      })
  }, [])

  console.log('debug', config, Lister)

  return (
    <>
      {/* {Lister && <Lister {...config} />} */}
      {Page && <Page schema={config} />}
    </>
  )
}

export default PageRender
