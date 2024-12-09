import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Grid, Typography, IconButton, Card, CardContent, Divider, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const FilterHeader = ({ link, title, subtitle, children }) => {
  const router = useRouter()
  const theme = useTheme()
  const [zIndex, setZIndex] = useState(0) // Initial z-index

  console.info(zIndex)

  useEffect(() => {
    const handleScroll = () => {
      // Set the height threshold to change z-index
      const heightThreshold = 100

      if (window.scrollY > heightThreshold) {
        setZIndex(1200) // Higher z-index when scrolled past threshold
      } else {
        setZIndex(0) // Reset to original z-index
      }
    }

    window.addEventListener('scroll', handleScroll)

    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <Grid
      container
      item
      xs={12}
      // pr={5}
      display='flex'
      justifyContent='space-between'
      spacing={4}
      sx={{
        position: 'sticky', // Makes the grid fixed
        top: 0, // Adjusts position from the top
        left: 50, // Adjusts position from the left
        // bottom:80,
        width: '100vw', // Full width of the viewport
        height: 'auto', // Height can be set as per your needs
        zIndex: zIndex, // Ensure it stays above other elements
        backgroundColor: theme.palette.customColors.bodyBg,

        // '#282a42'
        borderBottom: '1px solid #b9b9b9',
        marginBottom: 10

        // boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' // Adds shadow for better visibility
      }}

      // position='fixed'
      // zIndex='9999'
    >
      <Grid
        item
        xs={children?.length === 3 ? 6 : 8}
        display='flex'
        alignItems={subtitle ? 'flex-start' : 'center'}
        pb={3}
      >
        <IconButton onClick={() => (link ? router.push(link) : router.back())}>
          <i class='ri-arrow-left-line'></i>
        </IconButton>
        <Box display='flex' flexDirection='column' alignItems='flex-start'>
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: 18
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: 15
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Grid>
      {children}
    </Grid>
  )
}

export default FilterHeader
