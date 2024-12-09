import React, { useState } from 'react'

import { IconButton, Menu, MenuItem, Checkbox } from '@mui/material'

const ColumnVisibility = ({ visibleColumns, setVisibleColumns }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  return (
    <div>
      <th
        style={{
          width: '50px',
          position: 'sticky',
          right: 0,
          textAlign: 'center',
          verticalAlign: 'middle'
        }}
      >
        <IconButton onClick={handleClick}>
          <i className='ri-eye-line text-textSecondary' />
        </IconButton>

        {/* Menu for column visibility */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          {Object.keys(visibleColumns)
            ?.filter(item => item !== 'action' && item !== 'select')
            .map(item => (
              <MenuItem key={item}>
                <Checkbox
                  checked={Boolean(visibleColumns[item])}
                  onChange={() =>
                    setVisibleColumns(prev => ({
                      ...prev,
                      [item]: !prev[item]
                    }))
                  }
                />
                {item}
              </MenuItem>
            ))}
        </Menu>
      </th>
    </div>
  )
}

export default ColumnVisibility
