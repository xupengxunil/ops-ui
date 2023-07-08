import axios from '~/axios'

export function login(username,password,ldap){
    return axios.post('/login',{
        username,
        password,
        ldap
    })
}

export function updatepassword(data){
    return axios.post('/updatepassword',data)
}


export function getinfo(){
    return axios.get('/menu/my')
}


export function getRoleList(page,search=''){
    return axios.get(`/user/role?page=${page}&search=${search}`)
}

export function createRole(data){
    return axios.post('/user/role/',data)
}

export function updateRole(id,data){
    return axios.patch(`/user/role/${id}/`,data)
}

export function deleteRole(id){
    return axios.delete(`/user/role/${id}/`)
}

export function getMenuListAll(){
    return axios.get(`/menu/menu?size=100`)
}

export function getUserList(page,search=''){
    return axios.get(`/user/user?page=${page}&search=${search}`)
}

export function changeUserStatus(id,active){
    return axios.patch(`/user/user/${id}/`,{'is_active':active})
}

export function updateUser(id,data){
    return axios.patch(`/user/user/${id}/`,data)
}

export function getAllRoleList(){
    return axios.get(`/user/role?page=1&size=1000`)
}