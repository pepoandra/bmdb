import React, { useRef } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import texture from '../imgs/films.jpeg'
import * as THREE from 'three';
import Roboto from '../imgs/roboto.json';


function TextMesh(props) {
    const mesh = useRef(null)

    let pageX = 0.5;
    let pageY = 0.5;
    // Get mouse coordinates inside the browser
    document.body.addEventListener('mousemove', (event) => {

        pageX = event.pageX / window.innerWidth;
        pageY = event.pageY / window.innerHeight;

    });
    useFrame(() => {
        mesh.current.rotation.x = (pageY - 0.5) * 2;
        mesh.current.rotation.y = (pageX - 0.5) * 2;
        mesh.current.geometry.center()
    })
    const font = new THREE.FontLoader().parse(Roboto);

    // configure font geometry
    const textOptions = {
        font,
        size: 10,
        height: 1
    };

    const three_texture = new THREE.TextureLoader().load(texture)
    three_texture.wrapS = THREE.RepeatWrapping
    three_texture.wrapT = THREE.RepeatWrapping
    three_texture.repeat.set(0.1, 0.1);

    return (
        <mesh position={[0, 0, -10]} ref={mesh}>
            <textGeometry attach='geometry' args={['BMDb', textOptions]} />
            <meshBasicMaterial attach='material' args={{ map: three_texture }}/>
        </mesh>
    )
}

export function Logo() {
    document.body.style.overflow = "hidden"

    return (
        <Canvas
            style={{
                height: '100vh',
                width: '100vw'
            }}
            camera={{ position: [0, 0, 10] }}
        >
            <TextMesh />
        </Canvas>
    );
}