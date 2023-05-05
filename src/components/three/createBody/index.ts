import * as THREE from "three";
import * as star from "./celestialBody";

/**初始化太阳系
 * @param scene 场景
 */
export default (scene: THREE.Scene) => {
  // 初始化太阳系轨道
  initOrBit(scene);

  // 创建点光源
  const directionalLight = new THREE.PointLight(0x999999, 1);
  directionalLight.shadow.radius = 20;
  directionalLight.shadow.mapSize.set(2048, 2048);

  // 创建太阳
  const sun = star.Sun;
  sun.add(directionalLight);
  sun.position.set(0, 0, 0);
  // 给太阳添加辉光
  sun.layers.enable(1.5);
  scene.add(sun);

  // 创建地月3D空间
  const earthMoonSystem = new THREE.Object3D();
  earthMoonSystem.name = 'earthMoonSystem'
  
  // 创建地球
  const earth = star.Earth;
  earthMoonSystem.add(earth);

  // 创建月球
  const moon = star.Moon;
  moon.name = 'moon'
  earthMoonSystem.add(moon);

  // 创建月球在地球的轨道
  const moonOrbit = new THREE.Line(
    new THREE.RingGeometry(1, 1, 26),
    new THREE.LineBasicMaterial({
      color: 0x999999,
      transparent: true,
      opacity: 0.2,
    })
  );
  moonOrbit.name = 'moon'
  moonOrbit.rotation.x = Math.PI / 2;

  earth.add(moon);
  earth.add(moonOrbit);

  scene.add(earthMoonSystem);

  // 创建水星
  const mercury = star.Mercury;
  scene.add(mercury);

  // 创建金星
  const venus = star.Venus;
  scene.add(venus);

  // 创建火星
  const mars = star.Mars;
  scene.add(mars);

  // 创建木星
  const jupiter = star.Jupiter;
  scene.add(jupiter);

  // 创建土星
  const saturn = star.Saturn;
  scene.add(saturn);

  // 添加天王星
  const uranus = star.Uranus;
  scene.add(uranus);

  // 添加海王星
  const neptune = star.Neptune;
  scene.add(neptune);
};

// 初始化太阳系轨道
const initOrBit = (scene: THREE.Scene) => {
  // 创建水星在太阳的轨道
  const mercuryOrbit = new THREE.Line(
    new THREE.RingGeometry(6, 6, 30),
    new THREE.LineBasicMaterial({
      color: 0x999999,
      transparent: true,
      opacity: 0.2,
    })
  );
  mercuryOrbit.name = 'mercury'
  mercuryOrbit.rotation.x = Math.PI / 2;
  scene.add(mercuryOrbit);

  // 创建金星在太阳的轨道
  const venusOrbit = new THREE.Line(
    new THREE.RingGeometry(8, 8, 40),
    new THREE.LineBasicMaterial({
      color: 0x999999,
      transparent: true,
      opacity: 0.2,
    })
  );
  venusOrbit.name = 'venus'
  venusOrbit.rotation.x = Math.PI / 2;
  scene.add(venusOrbit);

  // 创建地球在太阳的轨道
  const earthOrbit = new THREE.Line(
    new THREE.RingGeometry(11, 11, 40),
    new THREE.LineBasicMaterial({
      color: 0x999999,
      transparent: true,
      opacity: 0.2,
    })
  );
  earthOrbit.name = 'earthMoonSystem'
  earthOrbit.rotation.x = Math.PI / 2;
  scene.add(earthOrbit);

  // 创建火星在太阳的轨道
  const marsOrbit = new THREE.Line(
    new THREE.RingGeometry(13, 13, 40),
    new THREE.LineBasicMaterial({
      color: 0x999999,
      transparent: true,
      opacity: 0.2,
    })
  );
  marsOrbit.name = 'mars'
  marsOrbit.rotation.x = Math.PI / 2;
  scene.add(marsOrbit);

  // 创建木星在太阳的轨道
  const jupiterOrbit = new THREE.Line(
    new THREE.RingGeometry(16.5, 16.5, 60),
    new THREE.LineBasicMaterial({
      color: 0x999999,
      transparent: true,
      opacity: 0.2,
    })
  );
  jupiterOrbit.name = 'jupiter'
  jupiterOrbit.rotation.x = Math.PI / 2;
  scene.add(jupiterOrbit);

  // 创建土星在太阳的轨道
  const saturnOrbit = new THREE.Line(
    new THREE.RingGeometry(22.5, 22.5, 60),
    new THREE.LineBasicMaterial({
      color: 0x999999,
      transparent: true,
      opacity: 0.2,
    })
  );
  saturnOrbit.name = 'saturn'
  saturnOrbit.rotation.x = Math.PI / 2;
  scene.add(saturnOrbit);

  // 创建天王星星在太阳的轨道
  const uranusOrbit = new THREE.Line(
    new THREE.RingGeometry(26.5, 26.5, 70),
    new THREE.LineBasicMaterial({
      color: 0x999999,
      transparent: true,
      opacity: 0.2,
    })
  );
  uranusOrbit.name = 'uranus'
  uranusOrbit.rotation.x = Math.PI / 2;
  scene.add(uranusOrbit);

  // 创建海王星星在太阳的轨道
  const neptuneOrbit = new THREE.Line(
    new THREE.RingGeometry(29, 29, 80),
    new THREE.LineBasicMaterial({
      color: 0x999999,
      transparent: true,
      opacity: 0.2,
    })
  );
  neptuneOrbit.name = 'neptune'
  neptuneOrbit.rotation.x = Math.PI / 2;
  scene.add(neptuneOrbit);
};

