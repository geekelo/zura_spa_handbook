import footBones from '../assets/courses/foot-bones.jpg'
import footMuscles from '../assets/courses/foot-muscles.jpg'
import footOuterStructure from '../assets/courses/foot-outer-structure.jpg'
import posteriorLegAndCalf from '../assets/courses/posterior-leg-and-calf.jpg'
import massageStartPositions from '../assets/courses/massage-start-positions.jpg'

const mediaByPath = {
  'assets/courses/foot-bones.jpg': footBones,
  'assets/courses/foot-muscles.jpg': footMuscles,
  'assets/courses/foot-outer-structure.jpg': footOuterStructure,
  'assets/courses/posterior-leg-and-calf.jpg': posteriorLegAndCalf,
  'assets/courses/massage-start-positions.jpg': massageStartPositions,
}

export function resolveMediaSrc(src) {
  if (!src) return src
  return mediaByPath[src] || src
}
