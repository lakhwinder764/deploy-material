'use client'
import React, { useState } from 'react'

import { Grid, Tab } from '@mui/material'

import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

import CustomTabList from '@core/components/mui/TabList'

import FilterHeader from '@/components/globals/FilterHeader'
import DifficultiesList from './difficulty/DifficultiesList'
import ImportanceList from './importance/ImportanceList'

// API import

const QuestionBankSettings = ({ isLoading = false }) => {
  const [activeTab, setActiveTab] = useState('importance') // Ensure activeTab is initialized properly

  // Function to handle tab change
  const handleChange = (event, newValue) => {
    setActiveTab(newValue) // Update activeTab when a tab is clicked
  }

  return (
    <>
      <FilterHeader title='Question Bank Settings' subtitle='Mathematics Test' />
      <Grid container xs={12}>
        <Grid item xs={12}>
          <TabContext value={activeTab}>
            <CustomTabList value={activeTab} onChange={handleChange} variant='scrollable' pill='true'>
              <Tab
                label={
                  <div className='flex items-center gap-2'>
                    <i class='ri-lock-2-line' />
                    Importance
                  </div>
                }
                value='importance'
              />
              <Tab
                label={
                  <div className='flex items-center gap-2'>
                    <i class='ri-bookmark-line' />
                    Difficulty
                  </div>
                }
                value='difficulty'
              />
            </CustomTabList>
            <Grid item xs={12}>
              {/* TabPanels to render content for each tab */}

              <TabPanel value='importance' sx={{ marginTop: 10 }}>
                <ImportanceList />
              </TabPanel>
              <TabPanel value='difficulty' sx={{ marginTop: 10 }}>
                <DifficultiesList />
              </TabPanel>
            </Grid>
          </TabContext>
        </Grid>
      </Grid>
    </>
  )
}

export default QuestionBankSettings
