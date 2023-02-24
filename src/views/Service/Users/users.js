import { ref } from 'vue';
import { skapi } from '@/main';

export const changeSearchCondition = (value, searchParams) => {
    switch(value) {
        case 'user_id':
        case 'phone_number':
        case 'email':
        case 'gender':
        case 'locale':
            searchParams.condition = '=';
            break;
        case 'birthdate':
        case 'name':
            searchParams.condition = '>=';
            break;
    }
}