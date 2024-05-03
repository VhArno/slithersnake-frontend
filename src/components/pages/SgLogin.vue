<script setup lang="ts">
import axios from 'axios';
import SgButton from '../atoms/SgButton.vue';
import { authAxios, myAxios } from '@/instances/myAxios';
import { ref } from 'vue';
import { postLogin, getUser, getCsrfCookie } from '@/services/dataService'
import { useAuthStore } from '@/stores/auth';

const email = ref<string>('')
const password = ref<string>('')

const errors = ref<string[]>([])

const authStore = useAuthStore()

function login() {
    errors.value = []
    if (email.value && password.value) {
        authStore.login({ email: email.value, password: password.value })
    } else {
        errors.value.push('Fill in all fields')
    }
}
</script>

<template>
    <section class="login">
        <form id="login-form" method="post">
            <div class="form-intro">
                <img src="/img/profile-picture.jpg">
                <h2>Login</h2>
            </div>

            <div class="errors" v-for="(err, index) in errors" :key="index">{{ err }}</div>

            <div class="form-div">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" value="" v-model="email">
            </div>
            <div class="form-div">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" value="" v-model="password">
            </div>

            <SgButton @click.prevent="login">Login</SgButton>
            <RouterLink to="/register" class="link">New to SlitherGrid?</RouterLink>
        </form>
    </section>
</template>

<style scoped lang="scss">
.login {
    color: var(--default-text-dark);
    background-color: var(--bg2-dark);
    margin: 2rem;
    padding: 1.5rem;
    border-radius: 10px;
    width: 80%;
    margin-left: auto;
    margin-right: auto;

    #login-form {
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        width: 80%;
        margin-left: auto;
        margin-right: auto;

        .errors {
            color: red
        }

        .form-intro {
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;

            > img {
                width: 6rem;
            }
        }

        .form-div {
            display: flex;
            flex-flow: column;
            width: 100%;

            input[type="email"], input[type="password"] {
                height: 2.3em;
                border-radius: 5px;
                border: none;
            }
        }

        button {
            width: 80%;
        }

        a {
            color: var(--accent-light);
        }
    }
}

/* BREAKPOINTS */
@media (width >= 65em) {
    .login {
        width: 40%;

        #login-form {
            width: 60%;
        }
    }
}
</style>