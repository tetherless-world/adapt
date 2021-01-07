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
}

export interface InputWrapperProps {
  typeUri: string
  selectorProps?: SelectorProps
  [k: string]: any
}

export const InputWrapper: React.FC<InputWrapperProps> = ({
  typeUri,
  selectorProps,
  ...props
}) => {
  let inputType: string = typeMap[typeUri]
  return inputType === 'boolean' ? (
    <Selector
      options={[
        { value: true, label: 'True' },
        { value: false, label: 'False' },
      ]}
      {...selectorProps}
      {...props}
    />
  ) : inputType === 'string' ? (
    <Selector {...selectorProps} {...props} />
  ) : (
    <TextField type={inputType} InputLabelProps={{ shrink: true }} {...props} />
  )
}
