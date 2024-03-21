import { useState, useEffect, useCallback, useRef } from 'react'
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
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  closestCenter
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

  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)
  // điểm va chạm cuối cùng trước đó
  const lastOverId = useRef(null)

  useEffect(() => {

    setOrderedCoulumnsState(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])
  // Tìm 1 column theo cardId
  const findColumnByCardId = (cardId) => {
    return orderedCoulumnsState.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }
  // cập nhập state trong trường hợp di chuyển card giữa các col khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
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
        const rebuild_activeDraggingCard = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCard)
        // cập nhập lại mảng cardOrderIds chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)

      }
      return nextColumns
    })
  }
  // Trigger khi bắt đầu kéo 1 phần tử
  const handleDragStart = (e) => {
    // console.log('handleDragStart', e)
    setActiveDragItemId(e?.active?.id)
    setActiveDragItemType(e?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(e?.active?.data?.current)
    // nếu kéo card thì mới thực hiện hành động set giá trị oldColumn
    if (e?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(e?.active?.id))
    }
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
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }

  }
  // Trigger khi kết thúc hành động kéo 1 phần tử => hành động thả
  const handleDragEnd = (e) => {
    // console.log('handleDragEnd', e)
    const { active, over } = e
    // kiểm tra nếu ko tồn tại over (kéo ra ngoài màn hình thì rt tránh lỗi)
    if (!active && !over) return
    // Xử lý kéo thả cards
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCardId: card đang dc kéo
      const { id: activeDraggingCardId, data:{ current: activeDraggingCardData } } = active
      // overCardId: card đang dc tương tác trên or dưới so với card dc kéo ở trên
      const { id: overCardId } = over
      // Tìm 2 cái columns theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)
      // nếu ko tồn tại 1 trong 2 column thì ko làm gì hết (tránh crash trang)
      if (!activeColumn || !overColumn) return
      // Hành động kéo thả card giữa 2 column khác nhau (dùng activeDragItemData.columnId or oldColumnWhenDraggingCard._id)
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // Hành động kéo thả card trong cùng 1 column
        // lấy vị trí cũ từ oldColumnWhenDraggingCards
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // lấy vị trí mới từ oldColumnWhenDraggingCard
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)
        // Dùng arrayMove vì kéo card trong 1 column thì tương tự vs logic kéo column trong 1 cái board content
        const dndOrderedCardsState =arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        setOrderedCoulumnsState(prevColumns => {
          // Clone mảng OrderedColumnsState cũ ra 1 cái mới để xử lý data rồi return - cập nhập OrderedColumnsState mới
          const nextColumns = cloneDeep(prevColumns)
          // tìm tới column đang thả
          const targetColumn = nextColumns.find(c => c._id === overColumn._id)
          // cập nhập 2 giá trị mới card và cardOrdredIds trong targetColumn
          targetColumn.cards = dndOrderedCardsState
          targetColumn.cardOrderIds = dndOrderedCardsState.map(card => card._id)
          return nextColumns
        })
      }
    }
    // Xử lý kéo thả columns
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {

      // Nếu vị trí sau khi kéo thé khác với vị trí ban đầu
      if (active.id !==over.id) {
        // lấy vị trí cũ từ active
        const oldColumnIndex = orderedCoulumnsState.findIndex(c => c._id === active.id)
        // lấy vị trí mới từ over
        const newColumnIndex = orderedCoulumnsState.findIndex(c => c._id === over.id)

        const dndOrderedCoulumnsState =arrayMove(orderedCoulumnsState, oldColumnIndex, newColumnIndex)
        // clg dùng dữ liệu này sau dùng để xử lý API
        // const dndOrderedColumnIds = dndOrderedColumnIds.map(c=> c._id)
        // console.log('dndOrderedCoulumnsState',dndOrderedCoulumnsState)
        // cập nhập state columns ban đầu sau khi kéo thả
        setOrderedCoulumnsState(dndOrderedCoulumnsState)
      }
    }
    // những dữ liệu sau khi kéo thả này luôn phải đưa về giá trị mặc định ban đầu
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
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
  // arguments = các đối số ,tham số
  const collisionDetectionStrategy = useCallback((args) => {
    //  trường hợp kéo col thì dùng thuật toán closestCorners
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    {
      return closestCorners({ ...args })
    }
    // tìm các điểm giao nhau, va chạm với con trỏ
    const pointerIntersections = pointerWithin(args)
    // thuật toán phát hiện va chạm sẽ trả về 1 mảng va chạm ở đây
    const intersections = pointerIntersections?.length > 0 ?
      pointerIntersections : rectIntersection(args)
      // tìm overId đầu tiên trong intersections ở trên
    let overId = getFirstCollision(intersections, 'id')
    if (overId) {
      const checkColumn = orderedCoulumnsState.find(column => column._id === overId)
      if (checkColumn ) {
        overId = closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
      }
      lastOverId.current = overId
      return [{
        id:overId
      }]
    }
    // nếu overId là null thì trả về mảng rổng - tránh bug crash trang
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedCoulumnsState])


  return (
    // Box content
    <DndContext
      sensors={mySensors}
      // thuật toán phát hiện va chạm
      // collisionDetection={closestCorners}
      // custom thuật toán phát hiện va chạm
      collisionDetection={collisionDetectionStrategy}
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