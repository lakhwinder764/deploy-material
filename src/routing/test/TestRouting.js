import { MenuItem } from '@menu/vertical-menu'

const TestRouting = () => {
  return (
    <>
      <MenuItem href='/test/list' icon={<i className='ri-information-line' />}>
        Test
      </MenuItem>
      <MenuItem href='/test/questions' icon={<i className='ri-information-line' />}>
        Questions
      </MenuItem>
    </>
  )
}

export default TestRouting
