// Boards Details

import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoadBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock.data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI } from '~/apis'
function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const boardId = '65ff87991eabd165cc7937ba'
    // Call Api
    fetchBoardDetailsAPI(boardId)
      .then((board) => {
        setBoard(board)
      })
  }, [])
  return (
    <Container disableGutters maxWidth={false} sx={ { height: '100vh' }}>
      <AppBar />
      <BoardBar board={mockData?.board}/>
      <BoardContent board={mockData?.board}/>

    </Container>
  )
}

export default Board