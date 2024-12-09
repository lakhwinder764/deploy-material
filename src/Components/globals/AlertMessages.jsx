import { IconButton, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import 'react-toastify/ReactToastify.min.css'
// import { alertMessages } from '@/components/globals/AlertMessages'
export const alertMessages = (theme, type, title = '', subtitle = '') => {
  // Define a unique toast ID based on the type of message
  const toastId = `${type}-alert-toast`

  function convertString(input) {
    return input
      .toLowerCase()
      .split('_')
      .map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1))
      .join(' ')
  }

  // Only show the toast if it’s not already active
  if (!toast.isActive(toastId)) {
    return toast(
      t => (
        <div className={`is-full flex ${subtitle?.length ? 'items-start' : 'items-center'} justify-between`}>
          <div className='flex items-center'>
            <img
              src={
                type === 'error'
                  ? '/images/icons/error.svg'
                  : type === 'success'
                    ? '/images/icons/success.svg'
                    : type === 'info'
                      ? '/images/icons/info.svg'
                      : '/images/icons/success.svg'
              }
              alt='no_img'
              style={{
                width: '30px',
                height: '30px',
                marginRight: 10,
                marginTop: subtitle?.length ? -10 : 0
              }}
            />
            <div className='flex flex-col gap-0.5'>
              <Typography
                color={
                  type === 'error'
                    ? 'error.main'
                    : type === 'success'
                      ? 'success.main'
                      : type === 'info'
                        ? 'info.main'
                        : 'success.main'
                }
                className='font-medium'
              >
                {convertString(title)}
              </Typography>
              <Typography
                variant='caption'
                color={
                  type === 'error'
                    ? 'error.main'
                    : type === 'success'
                      ? 'success.main'
                      : type === 'info'
                        ? 'info.main'
                        : 'success.main'
                }
              >
                {subtitle}
              </Typography>
            </div>
          </div>
          <IconButton size='small' onClick={() => toast.dismiss(t.toastProps.toastId)}>
            <i
              className='ri-close-line text-xl '
              style={{
                color:
                  type === 'error'
                    ? theme?.palette?.error?.main
                    : type === 'success'
                      ? theme?.palette?.success?.main
                      : type === 'info'
                        ? theme?.palette?.info?.main
                        : theme?.palette?.primary?.main
              }}
            />
          </IconButton>
        </div>
      ),
      {
        toastId, // Set the unique toastId to prevent duplicate toasts
        style: {
          minWidth: '300px',
          background:
            type === 'error'
              ? 'rgba(255, 0, 0, 0.2)'
              : type === 'success'
                ? 'rgba(114, 225, 40, 0.2)'
                : type === 'info'
                  ? 'rgba(38, 198, 249, 0.2)'
                  : 'rgba(114, 225, 40, 0.2)'
        },
        closeButton: false
      }
    )
  }
}
