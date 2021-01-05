import { TextField } from '@material-ui/core'
import { SelectorProps, Selector } from './Selector'

const typeMap: Record<string, string> = {
  'http://www.w3.org/2001/XMLSchema#boolean': 'boolean',
  'http://www.w3.org/2001/XMLSchema#string': 'string',
  'http://www.w3.org/2001/XMLSchema#decimal': 'number',
  'http://www.w3.org/2001/XMLSchema#float': 'number',
  'http://www.w3.org/2001/XMLSchema#time': 'time',
  'http://www.w3.org/2001/XMLSchema#date': 'date',
  'http://www.w3.org/2001/XMLSchema#dateTime': 'dateTime-local',
}

type BaseInputProps = { typeUri: string }

export type InputWrapperProps = BaseInputProps & Partial<SelectorProps>

export const InputWrapper: React.FC<InputWrapperProps> = ({
  typeUri,
  ...props
}) => {
  const inputType: string = typeMap[typeUri]
  return inputType === 'boolean' ? (
    <Selector
      options={[
        { value: true, label: 'True' },
        { value: false, label: 'False' },
      ]}
      {...props}
    />
  ) : inputType === 'string' ? (
    <Selector {...props} />
  ) : (
    <TextField type={inputType} InputLabelProps={{ shrink: true }} {...props} />
  )
}
