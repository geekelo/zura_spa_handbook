import pairReview from '../data/site/pair-review.json'
import { FormTopic } from './FormTopic'

export function PairReview() {
  return <FormTopic topic={pairReview} backTo="/categories" locked />
}
