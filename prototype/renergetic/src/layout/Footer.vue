<template>
    <div @click="logout">Logout</div>
    <div  @click="showLeftMenu">Click to {{!showMenu?'show':'hide'}} left menu</div>
</template>

<script>
import layoutBus from '@/events/layout.js';
import Keycloak from '@/plugins/authentication.js'

export default {
    name: 'Footer',
    data(){
        return {showMenu: false}
    },
    methods: {
        showLeftMenu(){
            this.showMenu = !this.showMenu;
            
            layoutBus.emit('show', {view: 'leftmenu', show: this.showMenu});
        },
        logout () {
            Keycloak.logout({ redirectUri: window.location.origin })
        }
    }
}
</script>

<style scoped>
    div {
        flex: 1 1 100%;
        text-align: center;
        background:var(--background);
        color: #a4ca4a;
        border-top: 2px solid #a4ca4a;
    }
</style>
