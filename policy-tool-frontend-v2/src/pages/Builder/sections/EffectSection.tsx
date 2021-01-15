import { Button, Grid, IconButton, TextField } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import _ from 'lodash'
import { MenuButton, Selector } from 'src/components'
import { Option, Value } from 'src/global'

export interface EffectSectionProps {
  effects: Value[]
  updateEffects: React.Dispatch<React.SetStateAction<Value[]>>
  validEffects: Option[]
}

const add = (value: Value) => (prev: Value[]): Value[] => [
  ...prev,
  _.cloneDeep(value),
]
const clear = (prev: Value[]): Value[] => []
const remove = (index: number) => (prev: Value[]): Value[] =>
  prev.filter((v, i) => i !== index)
const update = (index: number, value: any) => (prev: Value[]): Value[] =>
  prev.map((v, i) => (i !== index ? v : { ...v, value }))

export const EffectSection: React.FC<EffectSectionProps> = ({
  effects,
  updateEffects,
  validEffects,
}) => (
  <Grid container spacing={2}>
    <Grid container item spacing={1}>
      <Grid item xs={12} md={2}>
        <MenuButton
          options={[
            {
              label: 'Effect',
              menuItemProps: { disabled: !validEffects?.length },
            },
            {
              label: 'Custom Effect',
            },
          ]}
          onSelectOption={(i) =>
            updateEffects(
              add({
                value: null,
                type:
                  i === 0
                    ? 'http://www.w3.org/2002/07/owl#Class'
                    : 'http://www.w3.org/2001/XMLSchema#string',
              })
            )
          }
          buttonProps={{ children: 'Add' }}
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <Button
          onClick={() => updateEffects(clear)}
          disabled={!effects?.length}
        >
          Reset
        </Button>
      </Grid>
    </Grid>
    <Grid container item spacing={1}>
      {effects.map((e, i) => {
        let childProps = {
          label: `Effect ${i}`,
          onChange: (event: any) =>
            updateEffects(update(i, event?.target?.value)),
          value: e.value,
        }
        return (
          <>
            <Grid
              container
              item
              xs={12}
              spacing={1}
              alignItems={'flex-start'}
              key={i}
            >
              <Grid item>
                <IconButton onClick={() => updateEffects(remove(i))}>
                  <Delete />
                </IconButton>
              </Grid>
              <Grid item xs={11} md={6}>
                {e.type === 'http://www.w3.org/2002/07/owl#Class' && (
                  <Selector
                    options={validEffects}
                    textFieldProps={{ ...childProps }}
                  />
                )}
                {e.type === 'http://www.w3.org/2001/XMLSchema#string' && (
                  <TextField {...childProps} />
                )}
              </Grid>
            </Grid>
          </>
        )
      })}
    </Grid>
  </Grid>
)
