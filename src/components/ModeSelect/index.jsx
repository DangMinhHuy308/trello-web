
import { useColorScheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'

import Container from '@mui/material/Container'


function ModeSelect() {
  const { mode, setMode } = useColorScheme()
  const handleChange = (e) => {
    const selectMode =e.target.value
    setMode(selectMode)
  }
}
export default ModeSelect