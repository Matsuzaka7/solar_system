import * as THREE from "three";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

/** 辉光效果
 * @param scene 场景对象
 * @param camera 相机对象
 * @param renderer 渲染器对象
 * @returns [EffectComposer, EffectComposer, () => any, () => any]
 */
export default (scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => {
  // 添加辉光
  const BLOOM_LAYER = 1;
  const bloomLayer = new THREE.Layers();
  bloomLayer.set(BLOOM_LAYER);
  const renderPass = new RenderPass(scene, camera);
  // bloomComposer效果合成器 产生辉光，但是不渲染到屏幕上
  const bloomComposer = new EffectComposer(renderer);
  bloomComposer.renderToScreen = false; // 不渲染到屏幕上
  bloomComposer.addPass(renderPass);
  // 最终真正渲染到屏幕上的效果合成器 finalComposer
  const finalComposer = new EffectComposer(renderer);
  finalComposer.addPass(renderPass);

  const materials = {} as any;
  function darkenNonBloomed(obj: any) {
    if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
      materials[obj.uuid] = obj.material;
      obj.material = darkMaterial;
    }
  }

  // 辉光
  // 参数一：泛光覆盖场景大小 二维向量类型
  // 参数二：bloomStrength 泛光强度 值越大明亮的区域越亮 较暗区域变亮的范围越广
  // 参数三：bloomRadius 泛光散发半径
  // 参数四：bloomThreshold 泛光的光照强度阈值 如果照在物体上的光照强度大于该值就会产生泛光
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(
      renderer.domElement.offsetWidth,
      renderer.domElement.offsetHeight
    ),
    2,
    1,
    0.1
  );
  bloomComposer.addPass(bloomPass);

  const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
  function restoreMaterial(obj: any) {
    if (materials[obj.uuid]) {
      obj.material = materials[obj.uuid];
      delete materials[obj.uuid];
    }
  }

  const shaderPass = new ShaderPass(
    new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: bloomComposer.renderTarget2.texture },
      },
      vertexShader: `varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }`,
      fragmentShader: `
      uniform sampler2D baseTexture;
      uniform sampler2D bloomTexture;
      varying vec2 vUv;
      void main() {
        gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
      }`,
      defines: {},
    }),
    "baseTexture"
  ); // 创建自定义的着色器Pass，详细见下
  shaderPass.needsSwap = true;
  finalComposer.addPass(shaderPass);
  return [bloomComposer, finalComposer, darkenNonBloomed, restoreMaterial] as ResultType
}
type ResultType = [EffectComposer, EffectComposer, () => any, () => any];