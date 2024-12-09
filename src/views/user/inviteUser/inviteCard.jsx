import { useState } from 'react';
import { Card, CardContent, CardHeader, Button, TextField, MenuItem } from '@mui/material';

const InviteCard = ({ onInvite }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Student');
  const [emailError, setEmailError] = useState('');

  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Handle email change and validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!emailRegex.test(value)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const handleInvite = () => {
    if (email && role && !emailError) {
      const date = new Date().toLocaleString();
      onInvite({ email, role, date });
      setEmail('');
      setRole('Student');
    } else {
      console.log('Please fill all fields correctly');
    }
  };

  return (
    <Card sx={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', padding: 2 }}>
      <CardHeader title='Invite User by Email' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <div className='flex flex-col gap-4'>
          <div className='flex gap-4'>
            <TextField
              size='small'
              placeholder='Email Address'
              value={email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={emailError}
              sx={{ flex: 1 }}
            />
            <TextField
              size='small'
              select
              label='Role'
              value={role}
              onChange={(e) => setRole(e.target.value)}
              sx={{ flex: 1 }}
            >
              <MenuItem value='Teacher'>Teacher</MenuItem>
              <MenuItem value='Student'>Student</MenuItem>
            </TextField>
          </div>
          <Button
            variant='contained'
            onClick={handleInvite}
            sx={{ marginTop: 2, width: '125px' }}
            disabled={!!emailError || !email || !role}
          >
            Send Invite
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InviteCard;
