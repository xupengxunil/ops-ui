import axios from '~/axios'


export function updateSettings(id,data){
    return axios.patch(`/settings/settings/${id}/`,data)
}

export function getSettingsList(page,search=''){
    return axios.get(`/settings/settings?page=${page}&search=${search}`)
}

export function createSettings(data){
    return axios.post('/settings/settings/',data)
}
export function deleteSettings(id){
    return axios.delete(`/settings/settings/${id}/`)
}