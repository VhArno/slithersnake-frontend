<script setup lang="ts">

</script>

<template>
    <section class="login">
        <form id="login-form" method="post">
            <div class="form-intro">
                <img src="/img/profile-picture.jpg">
                <h2>Login</h2>
            </div>
            <div class="form-div">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" value="">
            </div>
            <div class="form-div">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" value="">
            </div>

            <button>Login</button>
            <a href="/register/">Already have an account?</a>
        </form>
    </section>
</template>

<style lang="scss">
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
            color: var(--default-text-dark);
        }
    }
}

/* BREAKPOINTS */
@media (width >= 65em) {
    .login {
        width: 60%;

        #login-form {
            width: 60%;
        }
    }
}
</style>