<script setup lang="ts">

</script>

<template>
  <section class="profile">
    <div class="user-profile">
        <div class="user-info">
          <div class="user-name">
            <h2>User154523</h2>
            <p>Lvl. 11</p>
          </div>

          <img src="/img/profile-picture.jpg" alt="user_profile">
        </div>
        
        <button>Change name</button>
    </div>

    <div class="user-stats">
        <ul>          
          <li>
            <h3>Highscore</h3>
            <p>15235</p>
          </li>
          <li>
            <h3>Games played</h3>
            <p>125</p>
          </li>
          <li>
            <h3>Games won</h3>
            <p>100</p>
          </li>
          <li>
            <h3>Win percentage</h3>
            <p>80%</p>
          </li>
          <li>
            <h3>Kills</h3>
            <p>50</p>
          </li>
          <li>
            <h3>Skins unlocked</h3>
            <p>10</p>
          </li>
        </ul>
    </div>
    <div>
      <RouterLink to="/login">Logout</RouterLink>
    </div>
  </section>
</template>

<style lang="scss">
.profile {
    color: var(--default-text-dark);
    background-color: var(--bg2-dark);
    margin: 2rem;
    padding: 1.5rem;
    border-radius: 10px;
    width: 80%;
    margin-left: auto;
    margin-right: auto;

    .user-profile {
        display: flex;
        flex-flow: column;
        align-items: first baseline;
        justify-content: space-between;
        gap: 1rem;

        .user-info {
            display: flex;
            gap: 0.5rem;

            .user-name {
                order: 1;
            }

            > img {
                width: 5rem;
            }
        }

        button {
            background-color: var(--accent);
            color: var(--default-text-dark);
            border: none;
            border-radius: 10px;
            padding: 0.4rem 2rem;
        }
    }

    .user-stats {
        margin: 2rem 0rem 0rem 0rem;
        > ul {
            display: flex;
            flex-flow: column;
            gap: 0.5rem;
            list-style-type: none;
            padding: 0;
        }
    }
}

/* BREAKPOINTS */
@media (width >= 65em) {
    .profile {
        width: 60%;

        .user-profile {
            flex-flow: row;
            align-items: flex-start;

            .user-info {
                flex: 3;
            }

            button {
                flex: 1;
            }
        }
    }
}
</style>