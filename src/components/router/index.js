import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Powersupplies from "@/components/views/Powersupplies";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/power-supplies',
        name: 'Stromversorgungen',
        component: Powersupplies
    }
];

const router = new VueRouter({
    routes
});

export default router
