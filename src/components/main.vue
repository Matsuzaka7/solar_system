<template>
  <div class="container">
    <div class="text-container">
      <div class="text-head">
        <h2>三维太阳系</h2>
        <p>使用Three.js制作，行星距离按照轨道速度计算设置，而非行星实际距离</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import gsap from "gsap";
import * as THREE from "three";
import { onMounted } from "vue";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import loader from "./three/loader";
import glow from "./three/glow";
import initBody from "./three/createBody/index";

// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  800
);
camera.position.set(20, 10, 20);
scene.add(camera);

// 创建环境光
const light = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(light);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
onMounted(() => {
  document.querySelector(".container")!.appendChild(renderer.domElement);
});
// 创建辉光
const [bloomComposer, finalComposer, darkenNonBloomed, restoreMaterial] = glow(
  scene,
  camera,
  renderer
);
// 初始化星球
initBody(scene);

// 添加环境贴图
const texture = loader.load("./images/8k_stars_milky_way.jpg", (texture) => {
  //设置纹理环绕方式
  texture.mapping = THREE.EquirectangularReflectionMapping; //全景
  //设置纹理环绕次数；
  texture.repeat.set(2, 2);
});
scene.background = texture;
scene.environment = texture;

renderer.render(scene, camera);

// 阻尼效果
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 6;

// 记录当前目标元素
let newTarget: any = null;
const render = () => {
  // 1. 利用 darkenNonBloomed 函数将除辉光物体外的其他物体的材质转成黑色
  scene.traverse(darkenNonBloomed);
  // 2. 用 bloomComposer 产生辉光
  bloomComposer.render();
  // 3. 将转成黑色材质的物体还原成初始材质
  scene.traverse(restoreMaterial);
  // 4. 用 finalComposer 作最后渲染
  finalComposer.render();

  // 持续跟踪一个目标物体
  if (newTarget) {
    
  }
  controls.update();
  requestAnimationFrame(render);
};
render();

// 节流阀
let once = 0;
// 创建点击事件
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const onMouseClick = (event: any, flag: boolean) => {
  // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围为 (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(mouse, camera);

  // 计算物体和射线的焦点
  const intersects = raycaster.intersectObjects(scene.children, true);
  for (let i = 0; i < intersects.length; i++) {
    const targetObj = intersects[i].object;
    // 操作交点处的物体
    scene.children.forEach((child) => {
      
      // 排他
      child.type === "Line" && child.material.color.set(0x999999);
      if (child.name === targetObj.name) {
        targetObj.type === "Line" && targetObj.material.color.set(0x3fb883);
        // 如果flag是true代表双击, 平滑的将相机划到目标行星位置
        if (flag) {
          // 节流只执行一次
          if (Date.now() - once > 1000) {
            if (child.type === "Mesh") {
              once = Date.now();
              // 设置目标物体
              controls.target = child.position;
              // 更新相机方向
              camera.lookAt(child.position);
              gsap.to(camera.position, {
                duration: 2,
                x: child.position.x + 5,
                y: child.position.y + 5,
                z: child.position.z + 5,
                ease: "Power2.easeInOut",
                onStart: function() {
                },
                onComplete: function() {
                  console.log('结束');
                  newTarget = child
                }
              })
              // const targetVector = new THREE.Vector3().copy(child.position); // 将目标物体的坐标转换为向量
              // console.log(targetVector);
              
              // 使用GSAP 3进行相机旋转动画
              // gsap.to(camera.rotation, {
              //   duration: 2,
              //   x: -(targetVector.sub(camera.position)).normalize().y * -1, // 计算旋转角度
              //   y: -(targetVector.sub(camera.position)).normalize().x, // 计算旋转角度
              //   z: -(targetVector.sub(camera.position)).normalize().z,
              //   onComplete: () => {
              //     controls.target = newTarget.position;
              //     // 更新相机方向
              //     camera.lookAt(newTarget.position);
              //   }
              // });
            } else if (child.name === "earthMoonSystem" && child.type === "Object3D") {
              // 处理地月系统
              once = Date.now();
              const objectPosition = child.children[0].position
              // 设置目标物体
              controls.target = objectPosition;
              // 更新相机方向
              camera.lookAt(objectPosition);
              gsap.to(camera.position, {
                duration: 2,
                x: objectPosition.x + 5,
                y: objectPosition.y + 5,
                z: objectPosition.z + 5,
                ease: "Power2.easeInOut",
                onStart: function() {
                },
                onComplete: function() {
                  newTarget = child.children[0]
                }
              })
            }
          }
        }
      }
    });
  }
};
window.addEventListener("mousemove", (event) => onMouseClick(event, false), false);
window.addEventListener("dblclick", (event) => onMouseClick(event, true), false);

// 创建键盘事件
window.addEventListener("keyup", (e) => {
  console.log(e.keyCode);
  
  switch (e.keyCode) {
    // ESC
    case 27:
      if (!newTarget) return;
      gsap.to(camera.position, {
        duration: 1.5,
        x: 20,
        y: 10,
        z: 20,
        onUpdate: () => {
          // 动画过程相机一直锁定目标元素
          camera.lookAt(new THREE.Vector3(0, 0, 0));
        },
        onComplete: () => {
          newTarget = null;
          controls.target = new THREE.Vector3(0, 0, 0);
        },
      });
      break;
    // 空格暂停旋转
    case 32:
      
    default:
      break;
  }
});

// 监听窗口大小变化 重新设置canvas大小
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
})
</script>

<style scoped>
.text-container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  color: #eee;
  pointer-events: none;
  user-select: none;
}
.text-head {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}
.text-head > p {
  color: #aaa;
  margin-top: 3px;
}
</style>
