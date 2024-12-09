import { useEffect, useState } from 'react'

import { Card, CardHeader, CardContent, Grid, Radio, TextField } from '@mui/material'

const TrueFalseQuestion = ({ choiceFields, setChoiceFields }) => {
  const [value, setValue] = useState('')
  const [truthyValue, setTruthyValue] = useState('true')
  const [falsyValue, setFalsyValue] = useState('false')
  const [changes, setChanges] = useState(false)

  console.info(choiceFields)

  const handleChange = event => {
    setValue(event.target.value)
  }

  // return (
  //   <Grid container item xs={12}>
  //     <Grid item xs={12}>
  //       <Card>
  //         <CardHeader title='Answer Choice' />
  //         <CardContent>
  //           <Grid container item xs={12}>
  //             <Grid item xs={0.5}>
  //               <Radio size='medium' value={truthyValue} onChange={handleChange} checked={value === truthyValue} />
  //             </Grid>
  //             <Grid item xs={4}>
  //               <TextField
  //                 size='small'
  //                 variant='outlined'
  //                 placeholder='True'
  //                 value={truthyValue}
  //                 onChange={e => setTruthyValue(e?.target?.value)}
  //               />
  //             </Grid>
  //           </Grid>
  //           <Grid container item xs={12} pt={4}>
  //             <Grid item xs={0.5}>
  //               <Radio size='medium' value={falsyValue} onChange={handleChange} checked={value === falsyValue} />
  //             </Grid>
  //             <Grid item xs={4}>
  //               <TextField
  //                 size='small'
  //                 variant='outlined'
  //                 placeholder='False'
  //                 value={falsyValue}
  //                 onChange={e => setFalsyValue(e?.target?.value)}
  //               />
  //             </Grid>
  //           </Grid>
  //         </CardContent>
  //       </Card>
  //     </Grid>
  //   </Grid>
  // )

  // Function to handle input text change
  const handleInputChange = (index, content) => {
    setChanges(true)
    const newFields = [...choiceFields]

    newFields[index].choice = content
    setChoiceFields(newFields)
  }

  // useEffect(() => {
  //   choiceFields[0].correct_answer = false
  //   choiceFields[1].correct_answer = false
  // }, [changes])

  // Function to handle checkbox change
  const handleRadioChange = (index, field, e) => {
    setChanges(false)
    const newFields = [...choiceFields]

    if (index === 1) {
      choiceFields[1].correct_answer = !newFields[index].correct_answer
      choiceFields[0].correct_answer = false
    } else {
      choiceFields[0].correct_answer = !newFields[index].correct_answer
      choiceFields[1].correct_answer = false
    }

    // choiceFields[index].correct_answer = !newFields[index].correct_answer
    // setRadios(true)

    // if (field === e?.target?.value) {
    // if (radios && choiceFields?.filter(item => item?.correct_answer)?.length === 1) {
    //   choiceFields[index].correct_answer = !newFields[index].correct_answer
    // }

    // }

    setChoiceFields(newFields)
  }

  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Answer Choice' />
          <CardContent>
            {choiceFields?.map((field, index) => (
              <Grid container item xs={12} key={field?.id} pt={4}>
                <Grid item xs={0.5}>
                  <Radio
                    size='medium'
                    value={field?.choice}
                    onChange={e => {
                      handleChange(e)
                      handleRadioChange(index, field?.choice, e)
                    }}
                    checked={changes ? false : field?.choice === value}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    size='small'
                    variant='outlined'
                    placeholder='True'
                    // eslint-disable-next-line lines-around-comment
                    // value={truthyValue}
                    // onChange={e => setTruthyValue(e?.target?.value)}
                    value={field?.choice}
                    onChange={e => handleInputChange(index, e?.target?.value)}
                  />
                </Grid>
              </Grid>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default TrueFalseQuestion
