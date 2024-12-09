// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import UserListTable from './UserListTable'


const UserList = ({ userData, addUsersData, updateUsersData, deleteUserData }) => {



  return (
    <Grid container spacing={6}>

      <Grid item xs={12}>
        <UserListTable
          tableData={userData}
          addUserData={addUsersData}
          updateUserData={updateUsersData}
          deleteUserData={deleteUserData}
        />
      </Grid>
    </Grid>
  )
}

export default UserList
