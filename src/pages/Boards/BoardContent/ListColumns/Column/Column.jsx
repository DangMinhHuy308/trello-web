import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Cloud from '@mui/icons-material/Cloud'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddCardIcon from '@mui/icons-material/AddCard'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ListCards from './ListCards/ListCards'
import { mapOrder } from '~/utils/sorts'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'

function Column({ column, createNewCard }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  // cards đã dc sắp xếp ở component cha
  const orderedCards = column.cards

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)
  const [newCardTitle, setNewCardTitle] = useState('')
  const addNewCard = () => {
    if (!newCardTitle) {
      toast.error('Please enter card title ')
      return
    }
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }
    createNewCard(newCardData)
    // console.log(newCardTitle)
    // Thêm thẻ mới ở đây
    setOpenNewCardForm() // Đóng trạng thái hiển thị của TextField
    setNewCardTitle('')
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable(
    {
      id: column._id,
      data:{ ...column }
    })

  const dndKitColumnStyles = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }
  return (
    <div ref={setNodeRef}
      style={dndKitColumnStyles}
      {...attributes}
    >
      <Box
        {...listeners}
        sx={{
          minWidth:'300px',
          maxWidth:'300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#33495e': '#ebecf0 '),
          ml:2,
          borderRadius:'6px',
          height:'fit-content',
          maxHeight:(theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}
      >
        {/* Header */}
        <Box sx={{
          height:(theme) => theme.trello.columnsHeaderHeight,
          p:2,
          display: 'flex',
          alignItems:'center',
          justifyContent:'space-between'
        }}
        >
          <Typography variant='h6' sx={{ fontWeight:'bold', cursor:'pointer', fontSize:'1rem' }}>{column?.title}</Typography>
          <Box>
            <div>
              <Tooltip title='More option'>
                <ExpandMoreIcon
                  sx={{ color:'text.primary', cursor:'pointer' }}
                  id="basic-button-dropdown"
                  aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                />
              </Tooltip>
              <Menu
                id="basic-menu-column-dropdown"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button-dropdown'
                }}
              >
                <MenuItem>
                  <ListItemIcon>
                    <AddCardIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Add new cart</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentCut fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Cut</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentCopy fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Copy</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentPaste fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Paste</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem>
                  <ListItemIcon>
                    <DeleteForeverIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Remove this column</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <Cloud fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Archive this column</ListItemText>
                </MenuItem>
              </Menu>
            </div>
          </Box>

        </Box>

        {/* List Card */}
        <ListCards cards={orderedCards}/>
        {/* Footer */}
        <Box sx={{
          height:(theme) => theme.trello.columnsFooterHeight,
          p:2
        }}>
          {!openNewCardForm
            ?
            <Box sx={{
              height:'100%',
              display: 'flex',
              alignItems:'center',
              justifyContent:'space-between'
            }}>
              <Button onClick={toggleOpenNewCardForm} startIcon={<AddCardIcon/>}>Add new cart</Button>
              <Tooltip title='Drag to move'>
                <DragHandleIcon sx={{ cursor:'pointer' }}/>
              </Tooltip>
            </Box>
            :
            <Box sx={{
              height:'100%',
              display: 'flex',
              alignItems:'center',
              gap:1
            }}>
              <TextField
                label="Enter card title..."
                type="text" size='small'
                variant='outlined'
                autoFocus
                data-no-dnd="true"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                  },
                  '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '& .MuiOutlinedInput-input': { borderRadius: 1 }
                  }
                }}
              />
              <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
                <Button
                  data-no-dnd="true"
                  onClick={addNewCard}
                  variant='contained'
                  color='success'
                  size='small'
                  sx={{
                    boxShadow:'none',
                    border: '0.5px solid',
                    borderColor:(theme) => theme.palette.success.main,
                    '&:hover': { bgcolor:(theme) => theme.palette.success.main }
                  }}>
                Add
                </Button>
                <CloseIcon fontSize='small' sx={{
                  color: (theme) => theme.palette.warning.light,
                  cursor: 'pointer',
                  '&:hover': { bgcolor:(theme) => theme.palette.warning.light }
                }}
                onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          }
        </Box>
      </Box>
    </div>
  )
}

export default Column