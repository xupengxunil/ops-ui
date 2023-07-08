import axios from '~/axios'

export function getHostList(page,search='',project='',env='',app=''){
    return axios.get(`/resource/host/?page=${page}&search=${search}&project=${project}&env=${env}&app=${app}`)
}

export function getDeployHostList(project='',env=''){
    return axios.get(`/resource/deployhost/?project=${project}&env=${env}`)
}

export function createHost(data){
    return axios.post('/resource/host/',data)
}

export function updateHost(id,data){
    return axios.patch(`/resource/host/?id=${id}`,data)
}

export function deleteHost(id){
    return axios.delete(`/resource/host/?id=${id}`)
}
export function getProjectListAll(){
    return axios.get(`/project/project?size=100`)
}


export function getConfigList(page,search='',project='',env=''){
    return axios.get(`/resource/config/?page=${page}&search=${search}&project=${project}&env=${env}`)
}

export function createConfig(data){
    return axios.post('/resource/config/',data)
}

export function updateConfig(id,data){
    return axios.patch(`/resource/config/${id}/`,data)
}

export function deleteConfig(id){
    return axios.delete(`/resource/config/${id}/`)
}


export function getNetHostList(page,search=''){
    return axios.get(`/resource/nethost/?page=${page}&search=${search}`)
}

export function createNetHost(data){
    return axios.post('/resource/nethost/',data)
}

export function updateNetHost(id,data){
    return axios.patch(`/resource/nethost/${id}/`,data)
}

export function deleteNetHost(id){
    return axios.delete(`/resource/nethost/${id}/`)
}

export function syncOsInfo(id){
    return axios.get(`/resource/syncosinfo/?id=${id}`)
}

export function resetRootPass(data){
    return axios.post('/resource/resetrootpass/',data)
}

export function getRootPass(id){
    return axios.get(`/resource/getrootpass/?id=${id}`)
}