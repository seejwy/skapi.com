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
    approved: {
        text: 'Block',
        show: state.viewport === 'desktop' ? true : false,
    },
    group: {
        text: 'Active',
        show: state.viewport === 'desktop' ? true : false,
    },
    access_group: {
        text: 'Access',
        show: false,
    },
    user_id: {
        text: 'User ID',
        show: true,
    },
    name: {
        text: 'Name',
        show: state.viewport === 'desktop' ? true : false,
    },
    email: {
        text: 'Email',
        show: state.viewport === 'desktop' ? true : false,
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
    timestamp: {
        text: 'Date Created',
        show: false,
    },
    locale: {
        text: 'Locale',
        show: false,
    },
    subscribers: {
        text: 'Subscribers',
        show: false,
    },
});

export const getValidationMessage = (searchParams) => {
    let message = '';

    switch(searchParams.searchFor) {
        case 'user_id':
            if(!skapi.validate.userId(searchParams.value)) message = 'Please enter a valid USER ID';
            break;
        case 'email':
            if(!skapi.validate.email(searchParams.value)) message = 'Please enter a valid email';
            break;
        case 'phone_number':
            if(!skapi.validate.phoneNumber(searchParams.value)) message = 'Please enter a valid phone number';
            break;
        case 'birthdate':
        case 'timestamp':
            let regex = /\d{4}-\d{2}-\d{2}/;
            if(!searchParams.value.match(regex) || !(new Date(searchParams.value).getTime())) message = 'Please enter date in YYYY-MM-DD format'
    }

    return message;
}

export const placeholder = (type) => {
    let placeholder = 'Search';

    switch(type) {
        case 'timestamp':
        case 'birthdate':
            placeholder = 'YYYY-MM-DD';
            break;
        case 'locale':
            placeholder = '2 digit country code e.g. KR'
    }

    return placeholder;
}