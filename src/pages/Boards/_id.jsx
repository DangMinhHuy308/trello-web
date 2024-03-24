// Boards Details

import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoadBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock.data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI, updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardToDifferentColumnAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { Typography } from '@mui/material'

function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const boardId = '65ffcdb65d11140ed8b2a9e3'

    fetchBoardDetailsAPI(boardId)
      .then((boardData) => {
        boardData.columns = mapOrder(boardData.columns, boardData.columnOrderIds, '_id')

        boardData.columns.forEach(column => {
          if (isEmpty(column.cards)) {
            column.cards = [generatePlaceholderCard(column)]
            column.cardOrderIds = [generatePlaceholderCard(column)._id]
          } else {
            column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
          }
        })

        setBoard(boardData)
      })
      .catch((error) => {
        console.error('Error fetching board details:', error)
      // Xử lý lỗi khi không thể lấy chi tiết của bảng
      })
  }, [])

  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // cập nhập state board
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }
  // Func gọi API tạo mới card và làm lại dữ liệu state board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
    console.log('createdCard', createdCard)
    // cập nhập state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {

        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
      setBoard(newBoard)

    }
  }
  // func này gọi API và xử lý khi kéo thả column
  const moveColumns = (dndOrderedColumnsState) => {
    //  cập nhập cho chuẩn dữ liệu state board
    const dndOrderedColumnIds = dndOrderedColumnsState.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumnsState
    newBoard.columnOrderIds = dndOrderedColumnIds
    setBoard(newBoard)
    // gọi API update board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
  }
  // khi move card trong cùng column chỉ cần gọi API để cập nhập mảng cardOrderIds
  const moveCardInTheSameColumn = (dndOrderedCardsState, dndOrderedCardsIds, columnId) => {
    // update cho chuẩn dữ liệu state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCardsState
      columnToUpdate.cardOrderIds =dndOrderedCardsIds
      setBoard(newBoard)

    }
    // gọi API update column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardsIds })

  }
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumnsState) => {
    const dndOrderedColumnIds = dndOrderedColumnsState.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumnsState
    newBoard.columnOrderIds = dndOrderedColumnIds
    setBoard(newBoard)
    // gọi API
    let prevCardOrderIds = dndOrderedColumnsState.find(c => c._id === prevColumnId)?.cardOrderIds
    // xử lý vấn đề khi kéo card cuối cùng ra khỏi column, column rỗng sẽ có placeholder card, cần xóa nó đi trc khi gửi dữ liệu lên cho BE
    if (prevCardOrderIds[0]?.includes('placeholder-card')) prevCardOrderIds = []


    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumnsState.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }
  if (!board) {
    return (
      <Box sx={{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        gap:2,
        width:'100vw',
        height:'100vh'
      }}>
        <CircularProgress/>
        <Typography>Loading Board...</Typography>
      </Box>
    )
  }
  return (
    <Container disableGutters maxWidth={false} sx={ { height: '100vh' }}>
      <AppBar />
      <BoardBar board={board}/>
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}

      />

    </Container>
  )
}

export default Board