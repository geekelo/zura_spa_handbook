import { assessmentOfTheDay } from '../data'
import { FormTopic } from './FormTopic'

export function AssessmentOfTheDay() {
  return (
    <FormTopic
      topic={assessmentOfTheDay}
      backTo="/todays-tasks"
      locked
    />
  )
}
