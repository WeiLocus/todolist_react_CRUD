import axios from 'axios'

//定義URL
const baseURL = 'http://localhost:3001'

//get
export const  getTodos = async() => {
  try {
    const response = await axios.get(`${baseURL}/todos`)
    //回傳結果會封裝在data
    return response.data
  }
  catch (error) {
    console.log('[Get Todos failed]:',error)
  }
}
//create -> Post
export const createTodo = async (payload) => {
  //payload(打包後的資訊)裡面會有 title,isDone
  try {
    const { title, isDone } = payload;
    const response = await axios.post(`${baseURL}/todos`, {
      title,
      isDone,
    });
    return response.data;
  } catch (error) {
    console.log('[Create Todo failed]:', error);
  }
}
//patch
const patchTodo = () => {

}
//delete
const deleteTodo = () => {

}