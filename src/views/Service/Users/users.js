import { ref } from 'vue';
import { skapi } from '@/main';

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