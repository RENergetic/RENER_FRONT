<template>
    <select name="screen" id='screen' @change="goToScreen($event)" >
        <option :value="path.name" v-for='path of paths' :key='path.name'>{{path.name}}</option>
    </select>
</template>

<script>
import Keycloak from '@/plugins/authentication.js'
export default {
    name: 'TopMenu',
    props: {
        ip: String
    },
    data(){
        return {
            paths: []
        }
    },
    methods: {
        goToScreen(event){
            this.$router.replace({ name: event.target.value });
        },
        getPaths(){
            for (const route of this.$router.getRoutes()){
                if (Keycloak.data.resourceAccess['renergetic-app'] != undefined)
                    for (let role of Keycloak.data.resourceAccess['renergetic-app'].roles){
                        if (route.meta.roles != undefined && route.meta.roles.includes(role) && route.meta.requiresAuth != undefined){
                            this.paths.push({name: route.name, url: route.path});
                            break;
                        }
                    }
                if (route.meta.roles == undefined && route.meta.requiresAuth != undefined)
                    this.paths.push({name: route.name, url: route.path});
            }
        }
    },
    mounted(){
        this.$watch(
            () => this.$route,
            (to) => {
                document.getElementById('screen').value = to.name;
            }
        );

        if (Keycloak.ready)
            this.getPaths();     
        else 
            setTimeout(()=>this.getPaths(), 200)
    }
}
</script>

<style scoped>
    #screen {
        flex: 1 1 100%;
        text-align: center;
        background:var(--background);
        color: dimgray;
        border: 2px solid #a4ca4a;
    }
</style>
