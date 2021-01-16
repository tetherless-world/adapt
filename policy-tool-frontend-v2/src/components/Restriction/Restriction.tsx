// import _ from 'lodash'
// import { PropertyPath } from 'lodash'
// import { useContext } from 'react'

// export interface RestrictionProps {
//   keys: PropertyPath
// }


// const AttributeRestriction: React.FC<ExtendedRestrictionProps> = ({
//   keys,
//   restrictions,
// }) => {
//   return <></>
// }

// const ValueRestriction: React.FC<ExtendedRestrictionProps> = ({
//   keys,
//   restrictions,
// }) => {
//   return <></>
// }

// export const Restriction: React.FC<RestrictionProps> = ({ keys }) => {
//   const _keys = _.toPath(keys)
//   const restrictions = useContext(RequesterRestrictionsContext)

//   if (typeof restrictions === undefined) {
//     throw new Error('Restrictions undefined')
//   }

//   const restrictedProperty = restrictions?.get([..._keys, 'owl:onProperty'])

//   if (typeof restrictedProperty === undefined) {
//     throw new Error(`Invalid value for 'owl:onProperty'.`)
//   }

//   return restrictedProperty === 'sio:hasAttribute' ? (
//     <AttributeRestriction keys={keys} restrictions={restrictions} />
//   ) : restrictedProperty === 'sio:hasValue' ? (
//     <ValueRestriction keys={keys} restrictions={restrictions} />
//   ) : (
//     <div>Error: Restriction could not be rendered</div>
//   )
// }

export {}