import axios from '~/axios'


export function getdata(){
    return axios.get(`/data/statics/`)
}
