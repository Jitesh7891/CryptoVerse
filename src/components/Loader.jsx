import React from 'react'
import { Vortex } from "react-loader-spinner"
const Loader = () => {
  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:"center", height:"100vh"}} >

<Vortex
  visible={true}
  height="90"
  width="90"
  ariaLabel="vortex-loading"
  wrapperStyle={{}}
  wrapperClass="vortex-wrapper"
  colors={['red', '#3ce86a', 'blue', 'yellow', 'purple', 'turquoise']}
  />
    </div>
  )
}

export default Loader