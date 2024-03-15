
import Box from '@mui/material/Box'
function BoardBar() {
  return (
    <Box sx={{
      backroundColor: 'primary.dark',
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems:'center'
    }}>
            Broad bar
    </Box>
  )
}

export default BoardBar