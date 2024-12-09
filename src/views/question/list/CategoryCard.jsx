import React from 'react'
import { Card, CardContent, Typography, List, ListItem, Checkbox, FormControlLabel } from '@mui/material'

const categories = [
  { name: 'Math', subCategories: [] },
  { name: 'Science', subCategories: ['Science 1', 'Science 1.1', 'Science 1.11'] },
  { name: 'History', subCategories: [] },
  { name: 'English', subCategories: [] }
]

const CategoryCard = () => {
  return (
    <Card style={{ margin: '20px', padding: '10px' }}>
      <CardContent>
        <Typography variant='h6' component='div' gutterBottom>
          Category
        </Typography>
        <List>
          {categories.map((category, index) => (
            <div key={index}>
              <ListItem>
                <FormControlLabel control={<Checkbox />} label={category.name} />
              </ListItem>
              {category.subCategories.length > 0 && (
                <List style={{ paddingLeft: '20px' }}>
                  {category.subCategories.map((subCategory, subIndex) => (
                    <ListItem key={subIndex}>
                      <FormControlLabel control={<Checkbox />} label={subCategory} />
                    </ListItem>
                  ))}
                </List>
              )}
            </div>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

export default CategoryCard
