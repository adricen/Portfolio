import React, { useEffect, useState } from "react";

import { Canvas } from '@react-three/fiber'

const BasicCanvas = () => {
  const [active, setActive] = useState(false)

  return (
    <div id="canvas-container">
      <Canvas>
      <ambientLight intensity={0.1} />
      <directionalLight color="red" position={[0, 0, 5]} />
      <mesh scale={active ? 1.5 : 1} onClick={() => setActive(!active)} >
         <boxGeometry args={[5, 2, 2]} />
         <meshPhongMaterial />
       </mesh>
      </Canvas>
    </div>
  )
}
export default BasicCanvas
