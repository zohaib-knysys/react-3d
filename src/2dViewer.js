import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import matcapPorcelainWhite from "./matcap-porcelain-white.jpg";
import ThreeSTLLoader from "three-stl-loader";
import * as myConstClass from './constants';


const pathToStl = myConstClass.STLFILE.default;
const STLLoader = ThreeSTLLoader(THREE);

const loader = new STLLoader();
const textureLoader = new THREE.TextureLoader();
const imageLoader = new THREE.ImageLoader();


function createAnimate({ scene, camera, renderer }) {
  const triggers = [];

  function animate() {
    requestAnimationFrame(animate);

    triggers.forEach((trigger) => {
      trigger();
    });

    renderer.render(scene, camera);
  }
  function addTrigger(cb) {
    if (typeof cb === "function") triggers.push(cb);
  }
  function offTrigger(cb) {
    const triggerIndex = triggers.indexOf(cb);
    if (triggerIndex !== -1) {
      triggers.splice(triggerIndex, 1);
    }
  }

  return {
    animate,
    addTrigger,
    offTrigger
  };
}

export class C2dViewer extends React.Component {
  componentDidMount() {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
    camera.setViewOffset(innerWidth, innerHeight, innerWidth/5, 0, innerWidth/1.8, innerHeight);
      console.log(camera);
      loader.load(pathToStl, (geometry) => {
        const material = new THREE.LineBasicMaterial({
          color: 0xFFFFFF,

        });
          
        const mesh = new THREE.Mesh(geometry, material);
        
      mesh.geometry.center();

      scene.add(mesh);
      console.log(mesh);
      
    });


    const renderer = new THREE.WebGLRenderer();
    const controls = new OrbitControls(camera, renderer.domElement);
    console.log(controls);
    controls.enableRotate = false;
    controls.enablePan = false;

    controls.maxDistance = 700;
    controls.minDistance = 100;
    const secondaryLight = new THREE.AmbientLight(0xFFFFFF, 0, 1);
    secondaryLight.position.set(5, 5, 5);
    scene.add(secondaryLight);


    renderer.setSize(window.innerWidth/2.1, window.innerHeight);
    this.mount.appendChild(renderer.domElement);

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("resize", onWindowResize, false);

    const animate = createAnimate({ scene, camera, renderer });

    camera.position.z = 100;
    camera.zoom = 2.3;
    camera.updateMatrix();
    camera.updateProjectionMatrix();

    animate.animate();
  }
  render() {
    return <div ref={(ref) => (this.mount = ref)} />;
  }
}
