<script setup lang="ts">
import SgCheckbox from '../atoms/SgCheckbox.vue';
import SgSoundRange from '../atoms/SgSoundRange.vue';
</script>

<template>
  <div class="settings">
    <div class="title-div">
          <h2>Settings</h2>
        </div>

        <div class="sound-div horz-div">
          <h3>Sound</h3>
          <div>
            <SgSoundRange></SgSoundRange>
          </div>
        </div>

        <div class="mode-div horz-div">
          <h3>Dark mode</h3>
          <SgCheckbox></SgCheckbox>
        </div>

        <div class="controls-div">
          <h3>Controls</h3>
          <ul class="controls">
            <li>
              <p>Move left</p>
              <button>Arrow-left</button>
            </li>
            <li>
              <p>Move right</p>
              <button>Arrow-right</button>
            </li>
            <li>
              <p>Move up</p>
              <button>Arrow-up</button>
            </li>
            <li>
              <p>Move down</p>
              <button>Arrow-down</button>
            </li>
          </ul>
        </div>
  </div>
</template>

<style scoped lang="scss">
.settings {
  color: var(--default-text-dark);
  background-color: var(--bg2-dark);
  margin: 2rem;
  padding: 1.5rem;
  border-radius: 10px;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-flow: column;
  gap: 1rem;

  .title-div {
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: space-between;

    button {
      width: max-content;
    }
  }

  .horz-div {
    display: flex;
    flex-flow: column;
    gap: 0.5rem;
  }

  .controls {
    display: flex;
    flex-flow: column;
    gap: 1rem;
    list-style-type: none;

    > li {
      display: flex;
      flex-flow: column;
      gap: 0.5rem;

      p {
        font-size: 1.15em;
      }
    }
  }
}

/* BREAKPOINTS */
@media (width >= 65em) {
  .settings {
    width: 40%;

    .title-div {
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: space-between;

      button {
        width: max-content;
      }
    }

    .horz-div {
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: space-between;
    }

    .controls {
      display: flex;
      flex-flow: column;
      gap: 1rem;
      list-style-type: none;

      > li {
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;

        p {
          width: 100%;
        }
      }
    }
  }
}
</style>