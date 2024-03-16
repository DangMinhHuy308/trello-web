
import { useColorScheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import Select from '@mui/material/Select'
import Container from '@mui/material/Container'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'


function ModeSelect() {
  const { mode, setMode } = useColorScheme()
  const handleChange = (e) => {
    const selectMode =e.target.value
    setMode(selectMode)
  }
  return (
    <FormControl sx={{minWidth: '120px'}} size="small">
      <InputLabel id="label-select-dark-light">Mode</InputLabel>
      <Select
        labelId='label-select-dark-light-mode'
        id='select-dark-light-mode'
        value={mode}
        label='Mode'
        onChange={handleChange}>
        <MenuItem value='light'>
          <Box style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LightModeIcon fontSize='small'/> Light
          </Box>
        </MenuItem>
        <MenuItem value='dark'>
          <Box sx={{ display: 'flex', alignItems:'center', gap: 1 }}>
            <DarkModeOutlinedIcon fontSize='small'/> Dark
          </Box>
        </MenuItem>
        <MenuItem value='system'>
          <Box sx={{ display: 'flex', alignItems:'center', gap: 1 }}>
            <SettingsBrightnessIcon fontSize='small'/> System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  )
}
export default ModeSelect