import { showModal, notifyMessage } from "~/composables/util"
import { useRouter } from 'vue-router'
import { useStore } from "vuex";
import { ref, reactive } from 'vue'

export function useRepassword() {

    const router = useRouter()
    const store = useStore()
    // do not use same name with ref
    const form = reactive({
        oldpassword: '',
        password: '',
        repassword: ''
    })

    const rules = {
        oldpassword: [
            {
                required: true, message: '用户名不能为空', trigger: 'blur'
            }
        ],
        password: [
            {
                required: true, message: '密码不能为空', trigger: 'blur'
            }
        ],
        repassword: [
            {
                required: true, message: '用户名不能为空', trigger: 'blur'
            }
        ]
    }

    const ruleFormRef = ref(null)

    const formDrawerRef = ref(null)

    const openRepassword = () => formDrawerRef.value.open()

    const onSubmit = () => {
        ruleFormRef.value.validate((valid) => {
            if (!valid) {
                return false
            }
            formDrawerRef.value.showLoading()
            console.log(form)
            formDrawerRef.value.hideLoading()
        })
        console.log('submit!')
    }

    return {
        form,
        rules,
        ruleFormRef,
        formDrawerRef,
        openRepassword,
        onSubmit
    }

}


export function useLogout() {
    const router = useRouter()
    const store = useStore()
    function handleLogout() {
        showModal("退出登录？").then(res => {
            //清除token
            store.dispatch("logout")
    
            //返回登录页面
    
            router.push('/login')
    
            notifyMessage("退出登录成功")
    
    
        })
    }
    return{
        handleLogout
    }
}