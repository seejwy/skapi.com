import { reactive } from 'vue';
import { skapi, state } from '@/main';

export const changeSearchCondition = (value, searchParams) => {
    switch(value) {
        case 'user_id':
        case 'phone_number':
        case 'email':
        case 'gender':
        case 'locale':
        case 'birthdate':
            searchParams.condition = '=';
            break;
        case 'name':
            searchParams.condition = '>=';
            break;
    }
}

export const visibleFields = reactive({
    suspended: {
        text: 'Block',
        show: state.viewport.value === 'desktop' ? true : false,
    },
    group: {
        text: 'Status',
        show: state.viewport.value === 'desktop' ? true : false,
    },
    user_id: {
        text: 'User ID',
        show: true,
    },
    name: {
        text: 'Name',
        show: state.viewport.value === 'desktop' ? true : false,
    },
    email: {
        text: 'Email',
        show: state.viewport.value === 'desktop' ? true : false,
    },
    address: {
        text: 'Address',
        show: false,
    },
    gender: {
        text: 'Gender',
        show: false,
    },
    birthdate: {
        text: 'Birthdate',
        show: false,
    },
});