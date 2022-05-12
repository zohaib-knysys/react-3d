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

export class StlViewer extends React.Component {
  componentDidMount() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      750,
      window.innerWidth / window.innerHeight/1.6,
      10,
      100000
    );

    loader.load(pathToStl, (geometry) => {
      const material = new THREE.MeshMatcapMaterial({
        color: 0xFFFFFF,
        matcap: textureLoader.load(matcapPorcelainWhite)
      });
      const mesh = new THREE.Mesh(geometry, material);

      mesh.geometry.computeVertexNormals(true);
      mesh.geometry.center();

      scene.add(mesh);

      mesh.rotation.x = -0.7;

      
    });

    // initEnvironment({ scene, imageSrc: worldImage });

    const renderer = new THREE.WebGLRenderer();

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.maxDistance = 700;
    controls.minDistance = 100;

    /**
     * Light setup
     */
    const secondaryLight = new THREE.PointLight(0xff0000, 1, 100);
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

    camera.position.z = 500;

    animate.animate();
  }
  render() {
    return <div ref={(ref) => (this.mount = ref)} />;
  }
}
