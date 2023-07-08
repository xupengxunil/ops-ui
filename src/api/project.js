import axios from '~/axios'

export function getGroupList(page,search=''){
    return axios.get(`/project/group?page=${page}&search=${search}`)
}

export function getGroupListAll(){
    return axios.get(`/project/group?size=100`)
}

export function createGroup(data){
    return axios.post('/project/group/',data)
}

export function updateGroup(id,data){
    return axios.put(`/project/group/${id}/`,data)
}

export function deleteGroup(id){
    return axios.delete(`/project/group/${id}/`)
}

export function getProjectList(page,search=''){
    return axios.get(`/project/project?page=${page}&search=${search}`)
}

export function getAllProjectList(){
    return axios.get(`/project/project?page=1&size=1000`)
}

export function createProject(data){
    return axios.post('/project/project/',data)
}

export function updateProject(id,data){
    return axios.put(`/project/project/${id}/`,data)
}

export function deleteProject(id){
    return axios.delete(`/project/project/${id}/`)
}

export function getCompanyList(page,search=''){
    return axios.get(`/project/company?page=${page}&search=${search}`)
}

export function getCompanyListAll(){
    return axios.get(`/project/company?size=100`)
}

export function createCompany(data){
    return axios.post('/project/company/',data)
}

export function updateCompany(id,data){
    return axios.put(`/project/company/${id}/`,data)
}

export function deleteCompany(id){
    return axios.delete(`/project/company/${id}/`)
}

export function getProjectRoleList(page,search=''){
    return axios.get(`/project/role?page=${page}&search=${search}`)
}

export function getProjectRoleListAll(){
    return axios.get(`/project/role?size=100`)
}

export function createProjectRole(data){
    return axios.post('/project/role/',data)
}

export function updateProjectRole(id,data){
    return axios.put(`/project/role/${id}/`,data)
}

export function deleteProjectRole(id){
    return axios.delete(`/project/role/${id}/`)
}

export function getProjectUserList(project=''){
    return axios.get(`/project/user?project=${project}&size=100`)
}

export function createProjectUser(data){
    return axios.post('/project/user/',data)
}

export function updateProjectUser(id,data){
    return axios.put(`/project/user/${id}/`,data)
}

export function deleteProjectUser(id){
    return axios.delete(`/project/user/${id}/`)
}

export function getUserList(){
    return axios.get(`/user/userlist/`)
}
