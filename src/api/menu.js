import axios from '~/axios'


export function updateMenu(id,data){
    return axios.patch(`/menu/menu/${id}/`,data)
}

export function getMenuList(){
    return axios.get(`/menu/menu?page=1&size=1000`)
}

export function createMenu(data){
    return axios.post('/menu/menu/',data)
}

export function deleteMenu(id){
    return axios.delete(`/menu/menu/${id}/`)
}

export function getMenuTreeList(){
    return axios.get(`/menu/treelist?page=1&size=1000`)
}