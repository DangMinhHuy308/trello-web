// Boards Details

import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoadBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock.data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI,updateBoardDetailsAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const boardId = '65ffcdb65d11140ed8b2a9e3'
    // Call Api
    fetchBoardDetailsAPI(boardId)
    // xử lý vấn đề kéo thả vào 1 col rỗng
      .then((board) => {
        board.columns.forEach(column => {
          if (isEmpty(column.cards)) {
            column.cards = [generatePlaceholderCard(column)]
            column.cardOrderIds = [generatePlaceholderCard(column)._id]
          }
        })
        setBoard(board)
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
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
      setBoard(newBoard)

    }
  }
  // func này gọi API và xử lý khi kéo thả column
  const moveColumns = async (dndOrderedColumnsState) => {
    //  cập nhập cho chuẩn dữ liệu state board
    const dndOrderedColumnIds = dndOrderedColumnsState.map(c=> c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumnsState
    newBoard.columnOrderIds = dndOrderedColumnIds
    setBoard(newBoard)
    // gọi API update board
    await updateBoardDetailsAPI(newBoard._id, {columnOrderIds: newBoard.columnOrderIds })
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

      />

    </Container>
  )
}

export default Board