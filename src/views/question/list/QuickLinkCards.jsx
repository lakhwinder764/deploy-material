import React from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material'

const QuickLinksCard = () => {
  const router = useRouter()
  const search = useSearchParams()

  const testGuid = search.get('testguid')

  const manageTest = () => {
    router.push(`/test/manage?guid=${testGuid}`)
  }

  const manageSubmission = () => {
    router.push(`/attempt?guid=${testGuid}`)
  }

  const takeTest = () => {
    router.push(`/taketest?guid=${ENG1}`)
  }

  return (
    <Card sx={{ marginTop: 2, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant='h6' gutterBottom style={{ marginBottom: '15px' }}>
          Quick Links
        </Typography>
        <List style={{ marginRight: '15px', marginLeft: '-15px' }}>
          <ListItem button>
            <ListItemIcon>
              <i className='ri-file-list-line' style={{ color: '#8080808C' }} />
            </ListItemIcon>
            <ListItemText
              onClick={manageTest}
              primary={
                <Typography style={{ color: '#007AFF', fontSize: '15px', textDecoration: 'underline' }}>
                  Manage Test
                </Typography>
              }
            />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <i className='ri-user-line' style={{ color: '#8080808C' }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography style={{ color: '#007AFF', fontSize: '15px', textDecoration: 'underline' }}>
                  Enrolments
                </Typography>
              }
            />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <i className='ri-eye-line' style={{ color: '#8080808C' }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography style={{ color: '#007AFF', fontSize: '15px', textDecoration: 'underline' }}>
                  Preview
                </Typography>
              }
            />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <i className='ri-printer-line' style={{ color: '#8080808C' }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography style={{ color: '#007AFF', fontSize: '15px', textDecoration: 'underline' }}>
                  Print
                </Typography>
              }
            />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <i className='ri-upload-cloud-line' style={{ color: '#8080808C' }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography style={{ color: '#007AFF', fontSize: '15px', textDecoration: 'underline' }}>
                  Export
                </Typography>
              }
            />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <i className='ri-file-list-line' style={{ color: '#8080808C' }} />
            </ListItemIcon>
            <ListItemText
              onClick={takeTest}
              primary={
                <Typography style={{ color: '#007AFF', fontSize: '15px', textDecoration: 'underline' }}>
                  Take test as student
                </Typography>
              }
            />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <i className='ri-checkbox-line' style={{ color: '#8080808C' }} />
            </ListItemIcon>
            <ListItemText
              onClick={manageSubmission}
              primary={
                <Typography style={{ color: '#007AFF', fontSize: '15px', textDecoration: 'underline' }}>
                  Submission
                </Typography>
              }
            />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <i className='ri-settings-3-line' style={{ color: '#8080808C' }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography style={{ color: '#007AFF', fontSize: '15px', textDecoration: 'underline' }}>
                  Settings
                </Typography>
              }
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  )
}

export default QuickLinksCard
