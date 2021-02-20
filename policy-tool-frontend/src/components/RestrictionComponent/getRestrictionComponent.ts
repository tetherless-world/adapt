import {
  isAgentRestriction,
  isAttributeRestriction,
  isBoundedValueRestriction,
  isClassRestriction,
  isDisjointAttributeRestriction,
  isDisjointValueRestriction,
  isIntervalRestriction,
  isMaximalValueRestriction,
  isMinimalValueRestriction,
  isNamedNode,
  isValidityRestriction,
  isValueRestriction,
  Restriction,
} from 'src/types/restrictions'
import { RestrictionProps } from './props'
import {
  AgentRestrictionComponent,
  AttributeRestrictionComponent,
  ClassRestrictionComponent,
  IntervalRestrictionComponent,
  MinimalValueRestrictionComponent,
  MaximalValueRestrictionComponent,
  ValidityRestrictionComponent,
  ValueRestrictionComponent,
} from './subtypes'

export const getRestrictionComponent = (
  restriction?: Restriction
): React.FC<RestrictionProps> | undefined => {
  if (!restriction) return undefined

  if (isValidityRestriction(restriction)) return ValidityRestrictionComponent

  if (isAgentRestriction(restriction)) {
    if (
      isNamedNode(restriction['http://www.w3.org/2002/07/owl#someValuesFrom'])
    )
      return AgentRestrictionComponent

    return getRestrictionComponent(
      restriction['http://www.w3.org/2002/07/owl#someValuesFrom']
    )
  }

  if (isDisjointAttributeRestriction(restriction)) {
    if (isClassRestriction(restriction)) return ClassRestrictionComponent

    if (isDisjointValueRestriction(restriction)) {
      if (isValueRestriction(restriction)) return ValueRestrictionComponent

      if (isBoundedValueRestriction(restriction)) {
        if (isMinimalValueRestriction(restriction))
          return MinimalValueRestrictionComponent
        if (isMaximalValueRestriction(restriction))
          return MaximalValueRestrictionComponent
      }
    }
    if (isAttributeRestriction(restriction)) {
      if (isIntervalRestriction(restriction)) {
        // render range attribute, ensuring no invalid inputs
        return IntervalRestrictionComponent
      }

      // map and render children attributes
      return AttributeRestrictionComponent
    }
  }

  throw Error('Unknown RestrictionNode structure')
}
