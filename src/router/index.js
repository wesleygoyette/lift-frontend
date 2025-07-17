import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import AddEntryView from '../views/AddEntryView.vue'
import ViewEntriesView from '../views/ViewEntriesView.vue'
import ViewSingleEntryView from '../views/ViewSingleEntryView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import { useAuth } from '@/composables/useAuth'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: { requiresGuest: true }
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView,
            meta: { requiresGuest: true }
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: DashboardView,
            meta: { requiresAuth: true }
        },
        {
            path: '/add',
            name: 'add',
            component: AddEntryView,
            meta: { requiresAuth: true }
        },
        {
            path: '/entries',
            name: 'entries',
            component: ViewEntriesView,
            meta: { requiresAuth: true }
        },
        {
            path: '/entries/:id',
            name: 'entry',
            component: ViewSingleEntryView,
            meta: { requiresAuth: true }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: NotFoundView
        }
    ],
})

router.beforeEach((to, from, next) => {
    const { isAuthenticated } = useAuth()

    if (to.meta.requiresAuth && !isAuthenticated.value) {
        next('/login')
    } else if (to.meta.requiresGuest && isAuthenticated.value) {
        next('/dashboard')
    } else {
        next()
    }
})

export default router
