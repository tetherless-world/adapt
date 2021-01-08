import { TextField } from '@material-ui/core'
import { Dictionary } from 'lodash'
import { SelectorProps, Selector } from './Selector'

const typeMap: Dictionary<string> = {
  'http://www.w3.org/2001/XMLSchema#boolean': 'boolean',
  'http://www.w3.org/2001/XMLSchema#string': 'string',
  'http://www.w3.org/2001/XMLSchema#decimal': 'number',
  'http://www.w3.org/2001/XMLSchema#float': 'number',
  'http://www.w3.org/2001/XMLSchema#time': 'time',
  'http://www.w3.org/2001/XMLSchema#date': 'date',
  'http://www.w3.org/2001/XMLSchema#dateTime': 'dateTime-local',
  'http://www.w3.org/2002/07/owl#Class': 'class',
}

export interface InputWrapperProps extends Partial<SelectorProps> {
  typeUri: string
}

export const InputWrapper: React.FC<InputWrapperProps> = ({
  typeUri,
  ...props
}) => {
  let type = typeMap[typeUri]
  switch (type) {
    case 'boolean':
      return (
        <Selector
          {...props}
          options={[
            { value: true, label: 'True' },
            { value: false, label: 'False' },
          ]}
        />
      )
    case 'class':
      return <Selector {...props} />
    default:
      let { textFieldProps } = props
      return (
        <TextField
          type={type}
          InputLabelProps={{ shrink: true }}
          {...textFieldProps}
        />
      )
  }
}
