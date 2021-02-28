import { EdgeDefinition, ElementDefinition, ElementsDefinition, NodeDataDefinition, NodeDefinition } from 'cytoscape'
import { OWL, PROV, RDFS, SKOS, XSD } from 'src/namespaces'
import { Node } from 'src/types/base'
import { PolicyState } from 'src/types/policy'
import {
  isAgentRestriction,
  isAttributeRestriction,
  isClassRestriction,
  isDisjointAttributeRestriction,
  isDisjointHasValueRestriction,
  isHasBoundedValueRestriction,
  isHasMinimalValueRestriction,
  isHasValueRestriction,
  isLiteral,
  isNamedNode,
  isRestriction,
  isTypedNode,
  isUnitRestriction,
  isValidityRestriction,
} from 'src/types/restrictions'

interface MyNodeDefinition extends NodeDefinition {
  data: NodeDataDefinition & {
    id: string
  }
}

interface MyElementsDefinition extends ElementsDefinition {
  nodes: MyNodeDefinition[]
  edges: EdgeDefinition[]
}

export type ConversionResult = [MyElementsDefinition, MyNodeDefinition]

export const convertToGraph = (policy: PolicyState, labelByURI: Record<string, string>): ConversionResult => {
  let nodeIdCounter = 0

  const nodes: MyNodeDefinition[] = []
  const edges: EdgeDefinition[] = []

  const generateNodeId = () => `node-${nodeIdCounter++}`

  const convertToGraphNode = (node: Node): MyNodeDefinition => {
    if (isNamedNode(node))
      return {
        data: {
          id: generateNodeId(),
          label: labelByURI[node['@id']] ?? node['@id'],
        },
      }

    if (isTypedNode(node) && isLiteral(node))
      return {
        data: {
          id: generateNodeId(),
          label: node['@value']?.toString(),
        },
      }

    if (isTypedNode(node) && isRestriction(node)) {
      if (isValidityRestriction(node)) {
        if (node[OWL.onProperty]['@id'] === PROV.startedAtTime) {
          let startedAtTime = {
            data: {
              id: generateNodeId(),
              label: 'started at time',
            },
          }
          let value = convertToGraphNode(node[OWL.someValuesFrom][OWL.withRestrictions][0][XSD.minInclusive])
          nodes.push(value)
          edges.push({
            data: {
              label: 'greater than or equal to',
              source: startedAtTime.data.id,
              target: value.data.id,
            },
          })
          return startedAtTime
        }
        if (node[OWL.onProperty]['@id'] === PROV.endedAtTime) {
          let endedAtTime = {
            data: {
              id: generateNodeId(),
              label: 'ended at time',
            },
          }
          let value = convertToGraphNode(node[OWL.someValuesFrom][OWL.withRestrictions][0][XSD.maxInclusive])
          nodes.push(value)
          edges.push({
            data: {
              label: 'less than or equal to',
              source: endedAtTime.data.id,
              target: value.data.id,
            },
          })
          return endedAtTime
        }
      }

      if (isAgentRestriction(node)) {
        let wasAssociatedWith = {
          data: {
            id: generateNodeId(),
            label: 'was associated with',
          },
        }
        let child = convertToGraphNode(node[OWL.someValuesFrom])
        nodes.push(child)
        edges.push({
          data: {
            source: wasAssociatedWith.data.id,
            target: child.data.id,
            label: 'some',
          },
        })
        return wasAssociatedWith
      }

      if (isDisjointAttributeRestriction(node)) {
        let hasAttribute = {
          data: {
            id: generateNodeId(),
            label: 'has attribute',
          },
        }

        if (isClassRestriction(node)) {
          let child = isNamedNode(node[OWL.someValuesFrom])
            ? convertToGraphNode(node[OWL.someValuesFrom])
            : convertToGraphNode(node[OWL.someValuesFrom][OWL.intersectionOf][1])

          nodes.push(child)
          edges.push({
            data: {
              label: 'some',
              source: hasAttribute.data.id,
              target: child.data.id,
            },
          })
        }

        if (isAttributeRestriction(node)) {
          let [a, ...rest] = node[OWL.someValuesFrom][OWL.intersectionOf]
          let attrName = {
            data: {
              id: generateNodeId(),
              label: labelByURI[a['@id']] ?? a['@id'],
            },
          }
          nodes.push(attrName)
          edges.push({
            data: {
              label: 'some',
              source: hasAttribute.data.id,
              target: attrName.data.id,
            },
          })
          rest.map(convertToGraphNode).forEach((r) => {
            nodes.push(r)
            edges.push({
              data: {
                label: 'and',
                source: attrName.data.id,
                target: r.data.id,
              },
            })
          })
        }

        return hasAttribute
      }

      if (isDisjointHasValueRestriction(node)) {
        let hasValue = {
          data: {
            id: generateNodeId(),
            label: 'has value',
          },
        }

        if (isHasValueRestriction(node)) {
          let value = convertToGraphNode(node[OWL.hasValue])
          nodes.push(value)
          edges.push({
            data: {
              label: 'equal to',
              source: hasValue.data.id,
              target: value.data.id,
            },
          })
        }

        if (isHasBoundedValueRestriction(node)) {
          let [value, edgeLabel] = isHasMinimalValueRestriction(node)
            ? [
                convertToGraphNode(node[OWL.someValuesFrom][OWL.withRestrictions][0][XSD.minInclusive]),
                'greater than or equal to',
              ]
            : [
                convertToGraphNode(node[OWL.someValuesFrom][OWL.withRestrictions][0][XSD.maxInclusive]),
                'less than or equal to',
              ]

          nodes.push(value)
          edges.push({
            data: {
              label: edgeLabel,
              source: hasValue.data.id,
              target: value.data.id,
            },
          })
        }

        return hasValue
      }

      if (isUnitRestriction(node)) {
        let hasUnit = {
          data: {
            id: generateNodeId(),
            label: 'has unit',
          },
        }

        let child = isNamedNode(node[OWL.someValuesFrom])
          ? convertToGraphNode(node[OWL.someValuesFrom])
          : convertToGraphNode(node[OWL.someValuesFrom][OWL.intersectionOf][1])

        nodes.push(child)
        edges.push({
          data: {
            label: 'some',
            source: hasUnit.data.id,
            target: child.data.id,
          },
        })
        return hasUnit
      }
    }

    console.error('Unknown Node Structure')
    console.error(node)
    throw Error(JSON.stringify(node))
  }

  let root = { data: { id: generateNodeId(), label: policy['@id'] } }
  nodes.push(root)

  // add label
  let label = { data: { id: generateNodeId(), label: policy[RDFS.label] } }
  nodes.push(label)
  edges.push({
    data: {
      label: 'label',
      source: root.data.id,
      target: label.data.id,
    },
  })

  // add definition
  if (policy[SKOS.definition] !== '') {
    let def = { data: { id: generateNodeId(), label: policy[SKOS.definition] } }
    nodes.push(def)
    edges.push({ data: { source: root.data.id, target: def.data.id, label: 'definition' } })
  }

  // add precedences
  let precedence = {
    data: {
      id: generateNodeId(),
      label: labelByURI[policy[RDFS.subClassOf][0]['@id']] ?? policy[RDFS.subClassOf][0]['@id'],
    },
  }
  nodes.push(precedence)
  edges.push({
    data: {
      source: root.data.id,
      target: precedence.data.id,
      label: 'has precedence',
    },
  })

  // add effect
  let effect = {
    data: {
      id: generateNodeId(),
      label: labelByURI[policy[RDFS.subClassOf][1]['@id']] ?? policy[RDFS.subClassOf][1]['@id'],
    },
  }
  nodes.push(effect)
  edges.push({
    data: {
      source: root.data.id,
      target: effect.data.id,
      label: 'has effect',
    },
  })

  // action and restrictions
  let [action, ...rest] = policy[OWL.equivalentClass][OWL.intersectionOf]
  let actionNode = {
    data: {
      id: generateNodeId(),
      label: labelByURI[action['@id']] ?? action['@id'],
    },
  }
  nodes.push(actionNode)
  edges.push({ data: { source: root.data.id, target: actionNode.data.id, label: 'equivalent to' } })

  rest.map(convertToGraphNode).forEach((r) => {
    nodes.push(r)
    edges.push({ data: { source: actionNode.data.id, target: r.data.id, label: 'and' } })
  })

  return [{ nodes, edges }, root]
}
