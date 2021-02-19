import { exception } from 'console'
import {
  isAgentRestriction,
  isAttributeRestriction,
  isBaseAttributeRestriction,
  isBaseValueRestriction,
  isBoundedValueRestriction,
  isClassRestriction,
  isMaximalValueRestriction,
  isMinimalValueRestriction,
  isNamedNode,
  isValidityRestriction,
  isValueRestriction,
  RestrictionNode,
} from 'src/types/restrictions'
import { RestrictionProps } from './props'
import {
  AgentRestrictionComponent,
  AttributeRestrictionComponent,
  ClassRestrictionComponent,
  MaximalValueRestrictionComponent,
  MinimalValueRestrictionComponent,
  ValidityRestrictionComponent,
  ValueRestrictionComponent,
} from './SubtypeRestrictionComponents'

export const getRestrictionComponent = (
  restriction?: RestrictionNode
): React.FC<RestrictionProps> | undefined => {
  if (!restriction) return undefined

  if (isValidityRestriction(restriction)) return ValidityRestrictionComponent

  if (isAgentRestriction(restriction)) {
    if (isNamedNode(restriction['owl:someValuesFrom']))
      return AgentRestrictionComponent

    return getRestrictionComponent(restriction['owl:someValuesFrom'])
  }

  if (isBaseAttributeRestriction(restriction)) {
    if (isClassRestriction(restriction)) return ClassRestrictionComponent

    if (isBaseValueRestriction(restriction)) {
      if (isValueRestriction(restriction)) return ValueRestrictionComponent

      if (isBoundedValueRestriction(restriction)) {
        if (isMinimalValueRestriction(restriction))
          return MinimalValueRestrictionComponent
        if (isMaximalValueRestriction(restriction))
          return MaximalValueRestrictionComponent
      }
    }
    if (isAttributeRestriction(restriction)) {
      // if (isIntervalRestriction(restriction)) {
      //   // render range attribute, ensuring no invalid inputs
      //   return IntervalRestrictionComponent
      // }

      // map and render children attributes
      return AttributeRestrictionComponent
    }
  }

  throw exception('Unknown RestrictionNode structure')
}
