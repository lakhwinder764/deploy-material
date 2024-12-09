// MUI Imports
import { Grid } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

import { useTheme } from '@mui/material/styles'

import QuestionsSection from './QuestionsSection'

// Component Imports
// import CustomAvatar from '@core/components/mui/Avatar'

const TestCardItems = props => {
  // Props
  const { stats, avatarColor, subtitle: subtitle, linkheading1, linkheading2, report } = props
  const theme = useTheme()

  return (
    <Card
      sx={{
        boxShadow: `0px 3px 0px 0px ${avatarColor}, rgba(100, 100, 111, 0.2) 0px 7px 29px 0px, rgba(100, 100, 111, 0.2) 0px 7px 29px 0px, rgba(100, 100, 111, 0.2) 0px 7px 29px 0px`,
        paddingTop: 4,
        paddingBottom: 3,
        paddingLeft: 2,
        paddingRight: 2,
        ...(!report && {
          minHeight: '23vh'
        })
      }}
    >
      <CardContent className='flex flex-col justify-between gap-1'>
        <div className={`flex gap-3 flex-grow ${report ? 'flex-col' : 'items-center'}`}>
          <div className='flex items-center gap-2 flex-wrap'>
            <Typography fontSize={report ? 28 : 24} fontWeight={500} color={avatarColor}>
              {stats}
            </Typography>
          </div>
          <Typography
            variant={report ? 'h5' : 'body2'}
            fontWeight={400}
            color={!report ? avatarColor : theme?.palette?.common?.black}
          >
            {subtitle}
          </Typography>
        </div>
        {(linkheading1 || linkheading2) && (
          <div className='flex items-center gap-3 flex-grow '>
            {linkheading1 && (
              <Typography
                component='a'
                href='https://example.com'
                target='_blank'
                rel='noopener noreferrer'
                style={{ textDecoration: 'underline', textUnderlineOffset: 3 }} // Optional: to style the link
              >
                {linkheading1}
              </Typography>
            )}
            {linkheading2 && (
              <Typography
                component='a'
                href='https://example.com'
                target='_blank'
                rel='noopener noreferrer'
                style={{ textDecoration: 'underline', textUnderlineOffset: 3 }} // Optional: to style the link
              >
                {linkheading2}
              </Typography>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TestCardItems
