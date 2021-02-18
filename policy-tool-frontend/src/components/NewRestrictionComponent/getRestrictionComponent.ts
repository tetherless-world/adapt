import { exception } from 'console'
import {
  isAgentRestriction,
  isAttributeRestriction,
  isBaseAttributeRestriction,
  isBaseValueRestriction,
  isBoundedValueRestriction,
  isClassRestriction,
  isIntersectionClass,
  isMaximalValueRestriction,
  isMinimalValueRestriction,
  isNamedNode,
  isValidityRestriction,
  isValueRestriction,
  RestrictionNode
} from 'src/types/restrictions'
import { RestrictionProps } from './props'
import {
  AgentRestrictionComponent,
  AttributeRestrictionComponent,
  ClassRestrictionComponentA,
  ClassRestrictionComponentB,
  MaximalValueRestrictionComponentA,
  MaximalValueRestrictionComponentB,
  MinimalValueRestrictionComponentA,
  MinimalValueRestrictionComponentB,
  ValidityRestrictionComponent,
  ValueRestrictionComponentA,
  ValueRestrictionComponentB
} from './SubtypeRestrictionComponents'

export const getRestrictionComponent = (
  restriction?: RestrictionNode
): React.FC<RestrictionProps> | undefined => {
  if (!restriction) return undefined

  if (isValidityRestriction(restriction)) {
    return ValidityRestrictionComponent
  }
  if (isAgentRestriction(restriction)) {
    if (isNamedNode(restriction['owl:someValuesFrom'])) {
      return AgentRestrictionComponent
    }

    return getRestrictionComponent(restriction['owl:someValuesFrom'])
  }

  if (isBaseAttributeRestriction(restriction)) {
    if (isClassRestriction(restriction)) {
      if (isIntersectionClass(restriction['owl:someValuesFrom'])) {
        // render as selector using first named node as label
        return ClassRestrictionComponentA
      }

      // render as disabled selector
      return ClassRestrictionComponentB
    }

    if (isBaseValueRestriction(restriction)) {
      if (
        restriction['owl:someValuesFrom']['owl:intersectionOf'].length === 2
      ) {
        if (isValueRestriction(restriction)) {
          // simple input for the restriction
          return ValueRestrictionComponentA
        }

        if (isBoundedValueRestriction(restriction)) {
          if (isMinimalValueRestriction(restriction)) {
            // simple input for the restriction
            return MinimalValueRestrictionComponentA
          }

          if (isMaximalValueRestriction(restriction)) {
            // simple input for the restriction
            return MaximalValueRestrictionComponentA
          }
        }
      }

      if (isValueRestriction(restriction)) {
        // simple input for the restriction (with unit)
        return ValueRestrictionComponentB
      }

      if (isBoundedValueRestriction(restriction)) {
        if (isMinimalValueRestriction(restriction)) {
          // simple input for the restriction (with unit)
          return MinimalValueRestrictionComponentB
        }

        if (isMaximalValueRestriction(restriction)) {
          // simple input for the restriction (with unit)
          return MaximalValueRestrictionComponentB
        }
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

  throw exception('Undefined RestrictionNode structure')
}
