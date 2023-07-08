import axios from '~/axios'

export function getTodoList(page){
    return axios.get(`/tools/todolist?page=${page}`)
}

export function createTodo(data){
    return axios.post('/tools/todolist/',data)
}

export function updateTodo(id,data){
    return axios.patch(`/tools/todolist/${id}/`,data)
}

export function deleteTodo(id){
    return axios.delete(`/tools/todolist/${id}/`)
}