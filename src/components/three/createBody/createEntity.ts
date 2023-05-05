import { SphereGeometry, MeshPhongMaterial, MeshPhongMaterialParameters, Mesh } from 'three'
/**
 * 初始化球
 * @param sphere [半径, 水平分段, 垂直分段]
 * @param material 基础材质 options
 */
export const createSphere = (sphere: number[], material: MeshPhongMaterialParameters): Mesh => {
  const sphereGeometry = new SphereGeometry(...sphere)
  const sphereMaterial = new MeshPhongMaterial(material)
  const sphereObj = new Mesh(sphereGeometry, sphereMaterial)
  return sphereObj
}
