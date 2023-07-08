//生成10位的随机密码，必须包含大小写字母和数字，如果不符合要求，重新生成
export function randomPassword() {
    let password = '';
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{10,}$/)) {
        return password;
    } else {
        return randomPassword();
    }
}