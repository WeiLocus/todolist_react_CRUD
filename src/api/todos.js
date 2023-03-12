import axios from 'axios'

//定義URL:todo list server
const baseURL = 'https://todo-list.alphacamp.io/api';

const axiosInstance = axios.create({
  baseURL: baseURL
})
//Add a request interceptor
axiosInstance.interceptors.request.use (
  (config) => {
    //在header加上token
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error(error)
  }
)
//get
export const  getTodos = async() => {
  try {
    const response = await axiosInstance.get(`${baseURL}/todos`)
    //回傳結果會封裝在data
    return response.data.data
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
    const response = await axiosInstance.post(`${baseURL}/todos`, {
      title,
      isDone,
    });
    return response.data;
  } catch (error) {
    console.log('[Create Todo failed]:', error);
  }
}
//patch
export const patchTodo = async (payload) => {
  try {
    const { title, isDone, id } = payload
    //帶上要更新資料的id，放入要更新的資料
    const response = await axiosInstance.patch(`${baseURL}/todos/${id}`,{title, isDone})
    return response.data
  } catch (error) {
    console.error('[Patch Todo failed]:', error);
  }
}
//delete
export const deleteTodo = async (id) => {
  try {
    const response = await axiosInstance.delete(`${baseURL}/todos/${id}`)
    return response.data
  } catch (error) {
    console.error('[Delete Todo failed]:', error);
  }
}