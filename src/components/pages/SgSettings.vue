<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import SgCheckbox from '../atoms/SgCheckbox.vue';
import SgSoundRange from '../atoms/SgSoundRange.vue';
import type { Keybinds } from '@/types/'

const keybinds = ref<Keybinds>({
  left: 'Arrow-left',
  right: 'Arrow-right',
  up: 'Arrow-up',
  down: 'Arrow-down'
})

const pressedKey = ref('')

const handleKeyPress = (event: KeyboardEvent) => {
  pressedKey.value = event.key
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress);
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
}) 
</script>

<template>
  <div class="settings">
    <div class="title-div">
      <h2>Settings</h2>
      <p>Pressed key: {{ pressedKey }}</p>
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
              <button class="keybind">
                <span>{{ keybinds.left }}</span>
                <span><i class="fa-solid fa-xmark"></i></span>
              </button>
            </li>
            <li>
              <p>Move right</p>
              <button class="keybind">
                <span>{{ keybinds.right }}</span>
                <span><i class="fa-solid fa-xmark"></i></span>
              </button>
            </li>
            <li>
              <p>Move up</p>
              <button class="keybind">
                <span>{{ keybinds.up }}</span>
                <span><i class="fa-solid fa-xmark"></i></span>
              </button>
            </li>
            <li>
              <p>Move down</p>
              <button class="keybind">
                <span>{{ keybinds.down }}</span>
                <span><i class="fa-solid fa-xmark"></i></span>
              </button>
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

      .keybind {
        display: flex;
        flex-flow: row;
        align-items: center;
        gap: 0.5rem;
        flex: 1;

        &:hover {
          cursor: pointer;
        }

        span {
          width: 100%;
          font-size: 1.2em;

          i {
            font-size: 1.7em;
          }
        }
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