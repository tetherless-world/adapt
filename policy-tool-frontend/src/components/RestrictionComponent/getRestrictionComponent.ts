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
  isRestriction,
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
    return AgentRestrictionComponent
  }

  if (isDisjointAttributeRestriction(restriction)) {
    if (isClassRestriction(restriction)) return ClassRestrictionComponent

    if (isDisjointValueRestriction(restriction)) {
      if (isValueRestriction(restriction)) return ValueRestrictionComponent

      if (isBoundedValueRestriction(restriction)) {
        console.log(restriction)
        if (isMinimalValueRestriction(restriction))
          return MinimalValueRestrictionComponent
        if (isMaximalValueRestriction(restriction))
          return MaximalValueRestrictionComponent
      }
    }
    if (isAttributeRestriction(restriction)) {
      if (isIntervalRestriction(restriction)) {
        // TODO: Fix this component (currently broken)
        // render range attribute, ensuring no invalid inputs
        return IntervalRestrictionComponent
      }

      // map and render children attributes
      return AttributeRestrictionComponent
    }
  }
  console.error('Unknown Restriction Structure')
  console.error(restriction['http://www.w3.org/2002/07/owl#onProperty'])
  throw Error(JSON.stringify(restriction))
}
