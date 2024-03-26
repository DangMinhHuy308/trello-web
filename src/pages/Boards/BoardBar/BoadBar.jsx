
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import FilterListIcon from '@mui/icons-material/FilterList'
import BoltIcon from '@mui/icons-material/Bolt'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import { capitalizeFirstLetter } from '~/utils/formatters'
const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border:'none',
  borderRadius: '4px',
  paddingX: '5px',
  '.MuiSvgIcon-root':{
    color:'white'
  },
  '&:hover':{
    bgcolor:'primary.50'
  }
}
function BoardBar( { board }) {

  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems:'center',
      justifyContent: 'space-between',
      paddingX: 2,
      gap: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#33495e': '#1976d2 ')


    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip sx={MENU_STYLES}
            icon={<DashboardIcon />} label={board?.title} clickable/>
        </Tooltip>
        <Chip sx={MENU_STYLES}
          icon={<VpnLockIcon />} label={capitalizeFirstLetter(board?.type)} clickable/>
        <Chip sx={MENU_STYLES}
          icon={<AddToDriveIcon />} label='Add to google drive' clickable/>
        <Chip sx={MENU_STYLES}
          icon={<BoltIcon />} label='Automation' clickable/>
        <Chip sx={MENU_STYLES}
          icon={<FilterListIcon />} label='Filters' clickable/>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="outlined"
          startIcon={<PersonAddAlt1Icon/>}
          sx={{ color:'white', borderColor:'white',
            '&:hover':{ borderColor:'white' }
          }}
        >Invite</Button>

        <AvatarGroup max={4}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root':{
              width:34,
              height:34,
              fontSize:16,
              border:'none',
              color:'white',
              cursor: 'pointer',
              '&:first-of-type':{ bgcolor:'#a4b0be' }
            }
          }}
        >
          <Tooltip title='dangminhhuy'>
            <Avatar alt="dangminhhuy" src="https://lh3.googleusercontent.com/a/ACg8ocIDj9EfSVgTPUfO4wN6h5HWrQ2aHaUof4bwEiJiCxmZe8E=s96-c-rg-br100" />
          </Tooltip>
          <Tooltip title='luchanhung'>
            <Avatar alt="luchanhung" src="https://scontent.fsgn21-1.fna.fbcdn.net/v/t1.6435-1/136432846_388752422422853_2437436800060395086_n.jpg?stp=dst-jpg_p200x200&_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeF-UlRXyYB_jpkezq9VdvvbOVD0NddUaY85UPQ111Rpj3AxF5n8wWGm2imYf7hf8aqo09-vo46DeNBYihJOjZjq&_nc_ohc=gmUdsftPnEkAX8H59J5&_nc_ht=scontent.fsgn21-1.fna&oh=00_AfAxk0HOqEWixYTlyaMzgnveAcyO24wqvVLRjIq46DKmug&oe=661DDEE6" />
          </Tooltip>
          {/* <Tooltip title='luchanhung'>
            <Avatar alt="luchanhung" src="https://scontent.fsgn21-1.fna.fbcdn.net/v/t39.30808-6/277304189_3086337908362553_499339562608316562_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHc5MzklsPtW_05kWqpy23r1FKeEbfiF6zUUp4Rt-IXrLaKO7qM4S65ss5SOPAyJBZdqslurO4A8uXfJ9iMkEvg&_nc_ohc=q7yYYk8TuIsAX8lBcec&_nc_ht=scontent.fsgn21-1.fna&oh=00_AfCo99uKATfAa802b4bM8DuTaiucFW4KTgM7FhOYrdNTlw&oe=65FAD075" />
          </Tooltip>
          <Tooltip title='luchanhung'>
            <Avatar alt="luchanhung" src="https://scontent.fsgn21-1.fna.fbcdn.net/v/t39.30808-6/415775443_1076848783763444_912400440701530613_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHDMN02yJCCBAZ9LpY_hlFHNgFEz5xsaxE2AUTPnGxrEQ7rrd3GB41JDT0FHHCIMjtGZau2CriEBpzM5GXRddIu&_nc_ohc=5xdk-4tKwP8AX9ORAIW&_nc_ht=scontent.fsgn21-1.fna&oh=00_AfBYhj2W2j6EdVNPAAeGAwwcBb29QnFlyqEV1enHBpP6GQ&oe=65FB47DB" />
          </Tooltip> */}
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar