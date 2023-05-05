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
        if (flag && Date.now() - once > 1000) {
          // 点击的是球体或地月系统
          if (child.type === "Mesh" || (child.name === "earthMoonSystem" && child.type === "Object3D")) {
            once = Date.now();
            // 获取最深处的球体位置
            const targetObject = (function deep(child){
              if (child.children.length > 0) {
                if (child.position.x + child.position.y + child.position.z || child.name === 'sun') {
                  return child
                } else {
                  if (child.children[0].position.x + child.children[0].position.y + child.children[0].position.z) {
                    return child.children[0]
                  } else {
                    child.children.forEach((item, index) => deep(child.children[index]))
                  }
                }
              } else {
                return child
              }
            })(child)
            const objectPosition = targetObject.position
            const targetRadius = targetObject.geometry.parameters.radius
            controls.target = objectPosition;
            controls.minDistance = targetRadius * 2
            // 相机角度旋转
            var startQuaternion = new THREE.Quaternion().copy(camera.quaternion);  // 记录起始四元数
            var endQuaternion = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(camera.position, objectPosition, camera.up));  // 计算终止四元数
            gsap.to({}, {  // 创建空对象，用于执行 tween 动画
              duration: 0.5,  // 动画完成时间 1 秒
              ease: "Power2.easeInOut",
              onUpdate: function() {
                camera.quaternion.copy(startQuaternion).slerp(endQuaternion, this.progress());
              },
              onComplete: function() {}
            })

            gsap.to(camera.position, {
              duration: 2,
              x: objectPosition.x + targetRadius * 2,
              y: objectPosition.y + targetRadius * 2,
              z: objectPosition.z + targetRadius * 2,
              ease: "Power2.easeInOut",
              onComplete: function() {
                newTarget = child
                controls.target = objectPosition;
                camera.lookAt(objectPosition);
              }
            })
          }
        }
      }
    })
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
      var startQuaternion = new THREE.Quaternion().copy(camera.quaternion);  // 记录起始四元数
      var endQuaternion = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(camera.position, new THREE.Vector3(0, 0, 0), camera.up));  // 计算终止四元数
           
      gsap.to({}, {
        duration: 0.5,
        ease: "Power2.easeInOut",
        onUpdate: function() {
          camera.quaternion.copy(startQuaternion).slerp(endQuaternion, this.progress());
        },
        onComplete: function() {
          controls.target = new THREE.Vector3(0, 0, 0);
          camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
      })

      gsap.to(camera.position, {
        duration: 2,
        x: camera.position.x > 20 ? 20 : -20,
        y: 10,
        z: camera.position.z > 20 ? 20 : -20,
        ease: "Power2.easeInOut",
        onComplete: function() {
          newTarget = null;
        }
      })
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
