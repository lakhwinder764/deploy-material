'use client'
import { useState } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import Grid from '@mui/material/Grid'

// Component Imports
import Tab from '@mui/material/Tab'

import TabContext from '@mui/lab/TabContext'

import TabPanel from '@mui/lab/TabPanel'

import EditForm from './account/EditForm'
import UserProfileHeader from './UserProfileHeader'

import DeleteCard from './account/DeleteCard'
import DeactivateCard from './account/DeactivateCard'

import CustomTabList from '@core/components/mui/TabList'
import ChangePasswordEmail from './changePassword/ChangePasswordEmail'
import ChangePasswordManually from './changePassword/ChangePasswordManually'
import ChangePasswordOtp from './changePassword/ChangePasswordOtp'



const EditUser = () => {
  const searchParams = useSearchParams()
  const guid = searchParams.get('guid')

  console.log(guid);

  const [activeTab, setActiveTab] = useState('account') // Ensure activeTab is initialized properly

  // Function to handle tab change
  const handleChange = (event, newValue) => {
    setActiveTab(newValue) // Update activeTab when a tab is clicked
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProfileHeader />
      </Grid>
      <Grid item xs={12}>
      <TabContext value={activeTab}>
      <CustomTabList value={activeTab} onChange={handleChange} variant='scrollable' pill='true'>
        <Tab
          label={
            <div className='flex items-center gap-2'>
              <i className='ri-user-3-line text-lg' />
              Account
            </div>
          }
          value='account'
        />
        <Tab
          label={
            <div className='flex items-center gap-2'>
              <i className='ri-team-line text-lg' />
              Change Password
            </div>
          }
          value='changePassword'
        />
        <Tab
          label={
            <div className='flex items-center gap-2'>
              <i className='ri-computer-line text-lg' />
              Billing Plans
            </div>
          }
          value='billing'
        />
        <Tab
          label={
            <div className='flex items-center gap-2'>
              <i className='ri-link-m text-lg' />
              Notifications
            </div>
          }
          value='notifications'
        />
        <Tab
          label={
            <div className='flex items-center gap-2'>
              <i className='ri-link-m text-lg' />
              Tests
            </div>
          }
          value='tests'
        />
      </CustomTabList>
            <Grid item xs={12}>
         {/* TabPanels to render content for each tab */}
      <TabPanel value='account' sx={{ marginTop: 10 }} spacing ={6}>

        <EditForm />
        <DeleteCard />
        <DeactivateCard />

        {/* Render Account Edit Form */}
      </TabPanel>
      <TabPanel value='changePassword'  sx={{ marginTop: 10 }} >

        <ChangePasswordEmail /> {/* Render Change Password Form */}
      </TabPanel>

      


      </Grid>
      </TabContext>
      </Grid>

    </Grid>





  )
}

export default EditUser
