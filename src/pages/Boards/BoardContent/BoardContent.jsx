import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep } from 'lodash'
const ACTIVE_DRAG_ITEM_TYPE ={
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  // const pointerSensor = useSensor(PointerSensor, { activationConstraints: { distance: 10 } })
  // di chuyển ít nhất 10px mới kích hoạt event
  const mouseSensor = useSensor(MouseSensor, { activationConstraints: { distance: 10 } })
  // nhấn giũ 250ms và dung sai của cảm ứng thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, { activationConstraints: { delay:250, tolerance: 500 } })

  // const mySensors = useSensors(pointerSensor)

  const mySensors = useSensors(mouseSensor, touchSensor)


  // orderedCoulumnsState === orderedCoulumns
  const [orderedCoulumnsState, setOrderedCoulumnsState] = useState([])
  // cùng 1 thời diểm chỉ 1 phần tử đang dc kéo column hoặc card
  const [activeDragItemId, setActiveDragItemId] = useState(null)

  const [activeDragItemType, setActiveDragItemType] = useState(null)

  const [activeDragItemData, setActiveDragItemData] = useState(null)

  useEffect(() => {

    setOrderedCoulumnsState(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])
  // Tìm 1 column theo cardId
  const findColumnByCardId = (cardId) => {
    return orderedCoulumnsState.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  // Trigger khi bắt đầu kéo 1 phần tử
  const handleDragStart = (e) => {
    // console.log('handleDragStart', e)
    setActiveDragItemId(e?.active?.id)
    setActiveDragItemType(e?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(e?.active?.data?.current)
  }
  // Trigger trong quá trình kéo 1 phần tử => hành động thả

  const handleDragOver= (e) => {
    // không làm gì thêm nếu đang kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    // Cần đảm bảo nếu ko tồn tại active hoặc over thì ko làm gì (tránh crash trang)
    const { active, over } = e
    if (!active || !over) return
    // activeDraggingCardId: card đang dc kéo
    const { id: activeDraggingCardId, data:{ current: activeDraggingCardData } } = active
    // overCardId: card đang dc tương tác trên or dưới so với card dc kéo ở trên
    const { id: overCardId } = over
    // Tìm 2 cái columns theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    // nếu ko tồn tại 1 trong 2 column thì ko làm gì hết (tránh crash trang)
    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      setOrderedCoulumnsState(prevColumns => {
        // tìm vị trí của cái overCard trong column dích ( nới active sắp dc thả)
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
        //  logic tính toán 'cardIndex mới'
        let newCardIndex
        const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.height
        const modifier = isBelowOverItem ? 1:0
        newCardIndex = overCardIndex >= 0? overCardIndex + modifier : overColumn?.card?.length +1

        const nextColumns = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)
        if (nextActiveColumn) {
          // Xóa card ở column active (column cũ)
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
          // cập nhập lại mảng cardOrderIds chuẩn dữ liệu
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }
        if (nextOverColumn) {
          // kiểm tra xem card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì xóa nó trước
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
          //  Thêm cái card đang kéo vào overColumn theo vi trí index mới
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)
          // cập nhập lại mảng cardOrderIds chuẩn dữ liệu
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)

        }
        return nextColumns
      })
    }

  }
  // Trigger khi kết thúc hành động kéo 1 phần tử => hành động thả
  const handleDragEnd = (e) => {
    // console.log('handleDragEnd', e)
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log('hành động kéo thả card')
      return
    }
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

      setActiveDragItemId(null)
      setActiveDragItemType(null)
      setActiveDragItemData(null)

    }
  }
  const customDropAnimation ={
    sideEffect: defaultDropAnimationSideEffects({
      styles:{
        active:{
          opacity: '0.5'
        }
      }
    })
  }


  return (
    // Box content
    <DndContext
      sensors={mySensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#33495e': '#1976d2 '),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        display: 'flex',
        p:'10px 0'
      }}>
        <ListColumns columns={orderedCoulumnsState}/>
        <DragOverlay dropAnimation={customDropAnimation}>
          {(!activeDragItemType) && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData}/>}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData}/>}

        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent