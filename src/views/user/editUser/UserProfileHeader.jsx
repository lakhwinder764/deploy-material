import { useState, useEffect, useRef } from 'react'

import { useSearchParams } from 'next/navigation'

import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { Skeleton } from '@mui/material'

import CustomAvatar from '@core/components/mui/Avatar'

import useUserApi from '@/api/useUserApi'

const UserProfileHeader = () => {
  const searchParams = useSearchParams()
  const guid = searchParams.get('guid')
  const { fetchUserById, loader } = useUserApi()
  const [user, setUser] = useState(null)
  const [hasFetched, setHasFetched] = useState(false)
  const fileInputRef = useRef(null) // Create a reference for the file input

  useEffect(() => {
    const getUserData = async () => {
      if (guid && !hasFetched) {
        const fetchedUser = await fetchUserById(guid)

        setUser(fetchedUser)
        setHasFetched(true)
      }
    }

    getUserData()
  }, [guid, fetchUserById, hasFetched])

  const handleUploadClick = () => {
    fileInputRef.current.click() // Trigger the file input click
  }

  const handleFileChange = event => {
    const file = event.target.files?.[0]

    if (file) {
      // Handle the file upload logic here
      console.log('File selected:', file.name)

      // You can also implement any upload logic or state updates needed
    }
  }

  if (loader || !user) {
    return (
      <Card>
        <Skeleton variant='rectangular' width='100%' height={250} />
        <CardContent className='flex justify-center flex-col items-center gap-6 md:items-end md:flex-row !pt-0 md:justify-start'>
          <Skeleton variant='circular' width={120} height={120} />
          <div className='flex flex-col items-center sm:items-start gap-2'>
            <Skeleton width={200} height={40} />
            <div className='flex gap-6'>
              <Skeleton width={120} height={30} />
              <Skeleton width={120} height={30} />
              <Skeleton width={120} height={30} />
            </div>
          </div>
          <div className='flex gap-6'>
            <Skeleton width={100} height={40} />
            <Skeleton width={100} height={40} />
          </div>
        </CardContent>
      </Card>
    )
  }

  const capitalizeFirstLetter = string => {
    if (!string) return ''

    return string?.charAt(0)?.toUpperCase() + string?.slice(1)
  }

  const formatCreatedAt = dateString => {
    const date = new Date(dateString)
    const options = { month: 'long', year: 'numeric' }

    return date.toLocaleDateString(undefined, options)
  }

  const mapStatusFromPayload = status => {
    switch (status) {
      case '1':
        return 'Active'
      case '0':
        return 'Inactive'
      case '':
        return 'Pending'
      default:
        return 'Pending'
    }
  }

  return (
    <Card>
      <CardMedia src='/images/pages/profile-banner.png' className='bs-[250px]' />
      <CardContent className='flex justify-center flex-col items-center gap-6 md:items-end md:flex-row !pt-0 md:justify-start'>
        <div className='flex rounded-bs-xl mbs-[-30px] mli-[-5px] border-[5px] border-be-0 border-backgroundPaper bg-backgroundPaper'>
          <CustomAvatar
            alt='user-profile'
            src='/images/avatars/1.png'
            variant='rounded'
            sx={{ width: 120, height: 120, borderRadius: '8px' }}
          />
        </div>
        <div className='flex is-full flex-wrap justify-start flex-col items-center sm:flex-row sm:justify-between sm:items-end gap-5'>
          <div className='flex flex-col items-center sm:items-start gap-2'>
            <Typography variant='h4'>{capitalizeFirstLetter(user?.first_name)}</Typography>
            <div className='flex flex-wrap gap-6 gap-y-3 justify-center sm:justify-normal min-bs-[38px]'>
              <div className='flex items-center gap-2'>
                <i className='ri-profile-line' />
                <Typography className='font-medium'>{capitalizeFirstLetter(user?.role)}</Typography>
              </div>
              <div className='flex items-center gap-2'>
                <i className='ri-shield-check-line' />
                <Typography className='font-medium'>{mapStatusFromPayload(user?.status)}</Typography>
              </div>
              <div className='flex items-center gap-2'>
                <i className='ri-calendar-line' />
                <Typography className='font-medium'>{formatCreatedAt(user?.created_at)}</Typography>
              </div>
            </div>
          </div>

          <div className='flex flex-wrap gap-6 gap-y-3 justify-center sm:justify-normal min-bs-[38px]'>
            <Button variant='contained' onClick={handleUploadClick}>
              Upload Image
            </Button>
            <Button variant='outlined' color='error'>
              Reset
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Hidden file input */}
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }} // Hide the input
        accept='image/*' // Accept only image files
      />
    </Card>
  )
}

export default UserProfileHeader
