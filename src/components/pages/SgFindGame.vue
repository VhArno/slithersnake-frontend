<script setup lang="ts">
import { ref } from 'vue';
import SgButton from '../atoms/SgButton.vue'
import type { Room } from '@/types/'

const selectedRoom = ref<Room | null>(null);
const rooms = ref<Room[]>([
    {
        id: '5h4bg168zer4h56',
        name: 'fafafaf',
        map: {
            id: 0,
            name: ''
        },
        mode: {
            id: 0,
            name: ''
        },
        players: [],
        ping: 0
    },
    {
        id: 'gaz654g46rfga89a',
        name: 'zghr',
        map: {
            id: 0,
            name: ''
        },
        mode: {
            id: 0,
            name: ''
        },
        players: [],
        ping: 0
    }
])

const toggleSelectRoom = (room: Room) => {
    if (selectedRoom.value === room) {
        selectedRoom.value = null; 
    } else {
        selectedRoom.value = room;
    }
}
</script>

<template>
    <section class="main-sec">
        <table class="room-table">
            <tr class="heading">
                <th class="id">Room id</th>
                <th class="name">Room name</th>
                <th>Map</th>
                <th>Mode</th>
                <th>Players</th>
                <th>Ping</th>
            </tr>
            <tr v-for="room in rooms" :key="room.id" :class="['row', { 'selected': room === selectedRoom }]" @click="toggleSelectRoom(room)">
                <td>{{ room.id }}</td>
                <td>{{ room.name }}</td>
                <td>{{ room.map }}</td>
                <td>{{ room.mode }}</td>
                <td>{{ room.players.length }}</td>
                <td>{{ room.ping }}</td>
            </tr>
        </table>
        <div class="button-div">
            <SgButton :disabled="!selectedRoom" class="join-button">Join room</SgButton>
        </div>
    </section>
</template>

<style scoped lang="scss">
.main-sec {
    margin-top: 2rem;
    width: 80%;

    .room-table {
        width: 100%;
        border: 2px solid var(--default-text-dark);
        color: var(--default-text-dark);

        .heading {
            background-color: var(--default-text-dark);
            color: var(--main-bg-dark);
            border-bottom: 2px solid var(--default-text-dark);

            th {
                height: 2rem;
            }
        }

        .selected {
            background-color: var(--dark-gray);
        }

        .row {
            td {
                text-align: center;
                border-top: 2px solid var(--default-text-dark);
                height: 1.8rem;
            }

            &:hover {
                background-color: var(--dark-gray);
            }
        }
    }

    .button-div {
        display: flex;
        flex-flow: row;
        justify-content: end;

        .join-button {
            width: 20%;
            margin-top: 1rem;
        }
    }
}
</style>