import React from 'react'




const Attribute = ({ attribute }) => {


  return (
    <>
      <Grid container spacing={1} alignItems={'flex-end'}>
        <Grid item>
          <FormControl className={classes.formControl}>
            <InputLabel id={`attr_${index}`}>
              Attribute {index}
            </InputLabel>
            <Select labelId={`attr_${index}`} value={attribute.attr}>
              {validAttributes && validAttributes.map(({ label, value }) => (
                <MenuItem value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <UnionButton index={index} />
        </Grid>
      </Grid>
      <Grid
        container
        direction={'column'}
        className={classes.nested}
      >
        {attribute.values.map((v, i) => (
          <Grid
            container
            item
            spacing={2}
            alignItems={"flex-end"}
            key={`value_${index}_${i}`}
          >
            <Grid item>
              <FormControl className={classes.formControl}>
                <InputLabel id={`value_${index}`}>
                  Value {i}
                </InputLabel>
                <Select labelId={`value_${index}`}>
                  {/* TODO: map valid value options to MenuItems  */}
                  <MenuItem />
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <DeleteValueButton index={index} valueIndex={i} />
            </Grid>
          </Grid>
        ))}
      </Grid>
    </>
  )
}
