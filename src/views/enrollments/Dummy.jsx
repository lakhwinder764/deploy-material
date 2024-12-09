const arr1 = [
  {
    guid: '11',
    title: 'Question 1 title',
    type: 'mcmc'
  },
  {
    guid: '12',
    title: 'Question 2 title ',
    type: 'tf'
  },
  {
    guid: '13',
    title: 'Section title',

    type: 'section',
    children: [
      {
        guid: '14',
        title: 'Question 3 section title',
        type: 'mcmc'
      },
      {
        guid: '15',
        title: 'Question 4 section title',
        type: 'tf'
      }
    ]
  }
]

const result = arr1.map(item => {
  if (item?.type === 'section') {
    return {
      ...item?.children,
      section_title: item?.title
    }
  } else {
    return item
  }
})

console.log(result)
