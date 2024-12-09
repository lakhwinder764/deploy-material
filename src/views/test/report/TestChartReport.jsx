'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// Component Imports
import { Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from '@/libs/Recharts'

// Styled Component Imports
const AppRecharts = dynamic(() => import('@/libs/styles/AppRecharts'))

// Vars
const data = [
  { name: 'Incorrect Answered', value: 150, color: '#ff716d' },
  { name: 'Correct Answered', value: 100, color: '#8ee753' },
  { name: 'Unanswered', value: 110, color: '#fdc453' }
]

const RADIAN = Math.PI / 180

const renderCustomizedLabel = props => {
  // Props
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props

  // Vars
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill='#fff' textAnchor='middle' dominantBaseline='central' className='max-[400px]:text-xs'>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const TestChartReport = () => {
  return (
    <Card>
      <CardContent>
        <AppRecharts>
          <div className='bs-[350px]'>
            <ResponsiveContainer>
              <PieChart height={350} style={{ direction: 'ltr' }}>
                <Pie
                  data={data}
                  innerRadius={80}
                  dataKey='value'
                  label={renderCustomizedLabel}
                  labelLine={false}
                  stroke='none'
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AppRecharts>
        <div className='flex justify-center flex-wrap gap-6'>
          <Box className='flex items-center gap-1.5' sx={{ '& i': { color: '#ff716d' } }}>
            <i className='ri-circle-fill text-xs' />
            <Typography variant='body2'>Incorrect Answered</Typography>
          </Box>
          <Box className='flex items-center gap-1.5' sx={{ '& i': { color: '#8ee753' } }}>
            <i className='ri-circle-fill text-xs' />
            <Typography variant='body2'>Correct Answered</Typography>
          </Box>
          <Box className='flex items-center gap-1.5' sx={{ '& i': { color: '#fdc453' } }}>
            <i className='ri-circle-fill text-xs' />
            <Typography variant='body2'>Unanswered</Typography>
          </Box>
        </div>
      </CardContent>
    </Card>
  )
}

export default TestChartReport
