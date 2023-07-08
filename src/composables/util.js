import { ElNotification } from "element-plus";
import "element-plus/theme-chalk/el-notification.css";
import nprogress from "nprogress";

//提示信息
export function notifyMessage(message, type="success", dangerouslyUseHTMLString = false) {
    ElNotification({
        message,
        type,
        dangerouslyUseHTMLString,
        duration: 3000
    })
}

export function showModal(content="提示内容",type = "warning",title =""){
    return ElMessageBox.confirm(
        content,
        title,
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type,
        }
      )
}

//显示全屏loading
export function showFullLoading(){
  nprogress.start()
}


//隐藏全屏loading
export function hideFullLoading(){
  nprogress.done()
}
