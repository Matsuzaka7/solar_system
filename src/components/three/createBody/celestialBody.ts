import { RingGeometry, MeshBasicMaterial, DoubleSide, Mesh } from "three";
import { createSphere } from "./createEntity";
import loader from "../loader";
import gsap from "gsap";

const imagesPath = "./images";

/**太阳 */
export const Sun = (() => {
  const sun = createSphere([3.5, 32, 32], {
    color: 0xaaaaaa,
    map: loader.load(`${imagesPath}/8k_sun.jpg`),
    specular: 0xffffff,
    emissive: 0xfef33e,
    emissiveIntensity: 0.5,
  });
  sun.name = 'sun'
  return sun;
})();

/**地球 */
export const Earth = (() => {
  // 地球
  const earth = createSphere([0.5, 34, 34], {
    map: loader.load(`${imagesPath}/earth_no_clouds_4k.jpg`),
    bumpMap: loader.load(`${imagesPath}/earth_bump_4k.jpg`),
    bumpScale: 0.002,
    specularMap: loader.load(`${imagesPath}/earth_water_4k.png`),
    shininess: 25,
  });
  earth.name = 'earth'
  // 大气层云
  const cloud = createSphere([0.5, 34, 34], {
    map: loader.load(`${imagesPath}/fair_clouds_4k.png`), // 使用大气层纹理贴图
    transparent: true, // 设置材质透明
  });
  cloud.name = 'earth'
  cloud.scale.set(1.01, 1.01, 1.01);
  // 将大气网格对象的渲染顺序设为0，表面网格对象的渲染顺序设为1
  cloud.renderOrder = 0;
  cloud.renderOrder = 1;
  // 倾斜弧度
  earth.add(cloud);
  earth.rotation.z = 0.409105;
  // 设置地球自转一圈只需要十秒
  gsap.to(earth.rotation, {
    y: Math.PI * 2,
    duration: 10,
    repeat: -1,
    ease: "none",
  });
  // 设置位置
  let angle = Math.random() * Math.PI;
  // 半径
  let radius = 11;
  gsap.ticker.add(() => {
    angle += 0.01;
    earth.position.x = radius * Math.cos(angle);
    earth.position.z = radius * Math.sin(angle);
  });
  return earth;
})();

/**月球 */
export const Moon = (() => {
  const moon = createSphere([0.125, 34, 34], {
    color: 0xaaaaaa,
    map: loader.load(`${imagesPath}/8k_moon.jpg`),
  });
  moon.name = 'moon'
  // 设置位置
  moon.position.set(1, 0, 1);
  let angle = Math.random() * Math.PI;
  // 半径
  let radius = 1;
  gsap.ticker.add(() => {
    angle += 0.1;
    // 地球在太阳系的位置 * 角度 + 轨道半径
    moon.position.x = radius * Math.cos(angle);
    moon.position.z = radius * Math.sin(angle);
  });
  return moon;
})();

/**水星 */
export const Mercury = (() => {
  const mercury = createSphere([0.2, 34, 34], {
    color: 0xaaaaaa,
    map: loader.load(`${imagesPath}/8k_mercury.jpg`),
  });
  mercury.name = 'mercury'
  // 倾斜弧度
  mercury.rotation.z = 0.000174533;
  let angle = Math.random() * Math.PI;
  // 半径
  let radius = 6;
  gsap.ticker.add(() => {
    angle += 0.05;
    mercury.position.x = radius * Math.cos(angle);
    mercury.position.z = radius * Math.sin(angle);
  });
  return mercury;
})();

/**金星 and 金星大气 */
export const Venus = (() => {
  const venusBody = createSphere([0.47, 34, 34], {
    map: loader.load(`${imagesPath}/8k_venus_surface.jpg`), // 使用表面纹理贴图
  });
  venusBody.name = 'venus'
  const venusAtm = createSphere([0.47, 34, 34], {
    map: loader.load(`${imagesPath}/4k_venus_atmosphere.jpg`), // 使用大气层纹理贴图
    transparent: true, // 设置材质透明
    opacity: 0.95, // 设置材质透明度
  });
  // 将大气网格对象的缩放比例稍稍放大一些
  venusAtm.scale.set(1.01, 1.01, 1.01);
  // 将大气网格对象的渲染顺序设为0，表面网格对象的渲染顺序设为1
  venusAtm.renderOrder = 0;
  venusAtm.renderOrder = 1;
  venusBody.add(venusAtm);
  // 倾斜弧度
  venusBody.rotation.z = 3.095516;
  let angle = Math.random() * Math.PI;
  // 半径
  let radius = 8;
  gsap.ticker.add(() => {
    angle += 0.015;
    venusBody.position.x = radius * Math.cos(angle);
    venusBody.position.z = radius * Math.sin(angle);
  });

  return venusBody;
})();

/**火星 */
export const Mars = (() => {
  const mars = createSphere([0.25, 34, 34], {
    color: 0xaaaaaa,
    map: loader.load(`${imagesPath}/8k_mars.jpg`),
  });
  mars.name = 'mars'
  // 倾斜弧度
  mars.rotation.z = 0.439648;
  let angle = Math.random() * Math.PI;
  // 半径
  let radius = 13;
  gsap.ticker.add(() => {
    angle += 0.003;
    mars.position.x = radius * Math.cos(angle);
    mars.position.z = radius * Math.sin(angle);
  });
  return mars;
})();

/**木星 */
export const Jupiter = (() => {
  const jupiter = createSphere([1.5, 34, 34], {
    color: 0xaaaaaa,
    map: loader.load(`${imagesPath}/8k_jupiter.jpg`),
  });
  jupiter.name = 'jupiter'
  // 倾斜弧度
  jupiter.rotation.z = 0.0546288;
  let angle = Math.random() * Math.PI;
  // 半径
  let radius = 16.5;
  gsap.ticker.add(() => {
    angle += 0.001;
    jupiter.position.x = radius * Math.cos(angle);
    jupiter.position.z = radius * Math.sin(angle);
  });
  return jupiter;
})();

/**土星 and 土星光环 */
export const Saturn = (() => {
  const saturnBody = createSphere([1.25, 34, 34], {
    map: loader.load(`${imagesPath}/8k_saturn.jpg`),
  });
  saturnBody.name = 'saturn'

  // 圆环
  const ringGeometry = new RingGeometry(1.4, 2.25, 84);
  const ringMaterial = new MeshBasicMaterial({
    color: 0xffffff,
    side: DoubleSide,
    map: loader.load(`${imagesPath}/8k_saturn_ring_alpha.png`),
    transparent: true,
    opacity: 0.8,
  });

  const saturnRing = new Mesh(ringGeometry, ringMaterial);
  saturnRing.rotation.x = Math.PI / 2.25;
  saturnBody.add(saturnRing);

  // 倾斜弧度
  saturnBody.rotation.z = 0.466526;
  let angle = Math.random() * Math.PI;
  // 半径
  let radius = 22.5;
  gsap.ticker.add(() => {
    angle += 0.0007;
    saturnBody.position.x = radius * Math.cos(angle);
    saturnBody.position.z = radius * Math.sin(angle);
  });
  return saturnBody;
})();

/**天王星*/
export const Uranus = (() => {
  const uranus = createSphere([1, 34, 34], {
    color: 0xaaaaaa,
    map: loader.load(`${imagesPath}/2k_uranus.jpg`),
  });
  uranus.name = 'uranus'
  // 倾斜弧度
  uranus.rotation.z = 1.70654;
  let angle = Math.random() * Math.PI;
  // 半径
  let radius = 26.5;
  gsap.ticker.add(() => {
    angle += 0.0004;
    uranus.position.x = radius * Math.cos(angle);
    uranus.position.z = radius * Math.sin(angle);
  });
  return uranus;
})();

/**海王星 */
export const Neptune = (() => {
  const neptune = createSphere([0.95, 34, 34], {
    color: 0xaaaaaa,
    map: loader.load(`${imagesPath}/2k_neptune.jpg`),
  });
  neptune.name = 'neptune'
  // 倾斜弧度
  neptune.rotation.z = 0.494277;
  let angle = Math.random() * Math.PI;
  // 半径
  let radius = 29;
  gsap.ticker.add(() => {
    angle += 0.0002;
    neptune.position.x = radius * Math.cos(angle);
    neptune.position.z = radius * Math.sin(angle);
  });
  return neptune;
})();
