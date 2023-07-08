<template>
    <div class="password-generator">
      <el-form :model="form" ref="form" label-width="120px" class="password-generator-form">
        <el-form-item label="密码长度">
          <el-radio-group v-model="form.length">
            <el-radio :label="10">10位</el-radio>
            <el-radio :label="16">16位</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="包含字符">
          <el-checkbox v-model="form.includeUppercase">包含大写字母</el-checkbox>
          <el-checkbox v-model="form.includeLowercase">包含小写字母</el-checkbox>
          <el-checkbox v-model="form.includeNumbers">包含数字</el-checkbox>
          <el-checkbox v-model="form.includeSpecialChars">包含特殊字符</el-checkbox>
        </el-form-item>
        <el-form-item label="生成密码">
          <el-input v-model="generatedPassword" readonly></el-input>
          <el-button type="primary" @click="generatePassword">生成</el-button>
          <el-button type="primary" @click="copyPassword">复制</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>

  import { notifyMessage } from "~/composables/util"
  export default {
    data() {
      return {
        form: {
          length: 10,
          includeUppercase: true,
          includeLowercase: true,
          includeNumbers: true,
          includeSpecialChars: true
        },
        generatedPassword: ''
      };
    },
    methods: {
      generatePassword() {
        const characters = {
          uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
          lowercase: 'abcdefghijklmnopqrstuvwxyz',
          numbers: '0123456789',
          specialChars: '!#*&'
        };
  
        let availableChars = '';
        if (this.form.includeUppercase) {
          availableChars += characters.uppercase;
        }
        if (this.form.includeLowercase) {
          availableChars += characters.lowercase;
        }
        if (this.form.includeNumbers) {
          availableChars += characters.numbers;
        }
        if (this.form.includeSpecialChars) {
          availableChars += characters.specialChars;
        }
  
        let password = '';
        for (let i = 0; i < this.form.length; i++) {
          password += availableChars.charAt(Math.floor(Math.random() * availableChars.length));
        }
  
        if (!this.isPasswordValid(password)) {
          this.generatePassword();
        } else {
          this.generatedPassword = password;
        }
      },
      isPasswordValid(password) {
        if (this.form.includeUppercase && !/[A-Z]/.test(password)) {
          return false;
        }
        if (this.form.includeLowercase && !/[a-z]/.test(password)) {
          return false;
        }
        if (this.form.includeNumbers && !/[0-9]/.test(password)) {
          return false;
        }
        if (this.form.includeSpecialChars && !/[!#*&]/.test(password)) {
          return false;
        }
        return true;
      },
      copyPassword() {
        const el = document.createElement('textarea');
        el.value = this.generatedPassword;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        notifyMessage("密码已复制到剪贴板");
      }
    }
  };
  </script>
  
  <style scoped>
  .password-generator-form {
    width: 300px;
    margin: 0 0;
  }
  </style>
  