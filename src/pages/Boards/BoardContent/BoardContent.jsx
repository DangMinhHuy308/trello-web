import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext, PointerSensor, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
function BoardContent({ board }) {
  const pointerSensor = useSensor(PointerSensor, { activationConstraints: { distance: 10 } })
  // di chuyển ít nhất 10px mới kích hoạt event
  const mouseSensor = useSensor(MouseSensor, { activationConstraints: { distance: 10 } })
  // nhấn giũ 250ms và dung sai của cảm ứng thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, { activationConstraints: { delay:250, tolerance: 500 } })

  // const mySensors = useSensors(pointerSensor)

  const mySensors = useSensors(mouseSensor,touchSensor)


  // orderedCoulumnsState === orderedCoulumns
  const [orderedCoulumnsState, setOrderedCoulumnsState] = useState([])
  useEffect(() => {

    setOrderedCoulumnsState(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = (e) => {
    console.log('handleDragEnd', e)
    const { active, over } = e
    // kiểm tra nếu ko tồn tại over (kéo ra ngoài màn hình thì rt tránh lỗi)
    if (!over) return
    // Nếu vị trí sau khi kéo thé khác với vị trí ban đầu
    if (active.id !==over.id) {
      // lấy vị trí cũ từ active
      const oldIndex = orderedCoulumnsState.findIndex(c => c._id === active.id)
      // lấy vị trí mới từ over
      const newIndex = orderedCoulumnsState.findIndex(c => c._id === over.id)
      const dndOrderedCoulumnsState =arrayMove(orderedCoulumnsState, oldIndex, newIndex)
      // clg dùng dữ liệu này sau dùng để xử lý API
      // const dndOrderedColumnIds = dndOrderedColumnIds.map(c=> c._id)
      // console.log('dndOrderedCoulumnsState',dndOrderedCoulumnsState)
      // cập nhập state columns ban đầu sau khi kéo thả
      setOrderedCoulumnsState(dndOrderedCoulumnsState)
    }
  }
  return (
    // Box content
    <DndContext onDragEnd={handleDragEnd} sensors={mySensors}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#33495e': '#1976d2 '),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        display: 'flex',
        p:'10px 0'
      }}>
        <ListColumns columns={orderedCoulumnsState}/>
      </Box>
    </DndContext>
  )
}

export default BoardContent