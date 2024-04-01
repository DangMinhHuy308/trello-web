import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  // aixos trả về kq về property của nó là data
  return response.data
}
export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  // aixos trả về kq về property của nó là data
  return response.data
}
export const moveCardToDifferentColumnAPI = async ( updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  // aixos trả về kq về property của nó là data
  return response.data
}
// columns
export const createNewColumnAPI = async (newColumndata) => {
//   const response = await axios.post(`${API_ROOT}/v1/columns`,newColumndata)
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumndata)
  return response.data
}
export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  return response.data
}
export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`)
  return response.data
}
// cards
export const createNewCardAPI = async (newCarddata) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCarddata)
  return response.data
}