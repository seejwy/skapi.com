<template lang="pug">
.overlay-container
    form(@submit.prevent="createNewService")
        .overlay-container-title.hideOnTablet Create a New Service
        .overlay-container-text Your service will have its own dedicated instance and full postgres database. An API will be set up so you can easily interact with your new database.
        sui-input(type="text" :disabled="isCreatingService ? 'true' : null" placeholder="Name of Service" :value="serviceName" @input="(e) => serviceName = e.target.value" required)
        sui-button.line-button(v-if="state.viewport === 'desktop'" type="button" @click="emit('close', '')" style="margin-right: 16px;") Cancel
        SubmitButton(:loading="isCreatingService") Create Service
</template>
<!-- script below -->
<script setup>
import { inject, reactive, ref, watch, onBeforeUnmount } from 'vue';
import { state, skapi, regions } from '@/main';
import { useRoute, useRouter } from 'vue-router';

import Icon from './Icon.vue';
import SubmitButton from './SubmitButton.vue';

let route = useRoute();
let router = useRouter();
const emit = defineEmits(['close']);
const isCreatingService = ref(false);
let appStyle = inject('appStyle');
let pageTitle = inject('pageTitle');
let navbarMobileRightButton = inject('navbarMobileRightButton');
const serviceName = ref('');

if(state.viewport === 'mobile') {
    pageTitle.value = 'Create a new Service'
    appStyle.navBackground = '#505050';
    appStyle.background = '#333333';
    navbarMobileRightButton.value = {
        type: 'hidden'
    };
}

onBeforeUnmount(() => {
    appStyle.background = null;
    appStyle.navBackground = '#293fe6';
    pageTitle.value = 'skapi';
    navbarMobileRightButton.value = null;
});

const countries = {
    "AD": {
        "lat": 42.546245,
        "long": 1.601554,
        "name": "Andorra"
    },
    "AE": {
        "lat": 23.424076,
        "long": 53.847818,
        "name": "United Arab Emirates"
    },
    "AF": {
        "lat": 33.93911,
        "long": 67.709953,
        "name": "Afghanistan"
    },
    "AG": {
        "lat": 17.060816,
        "long": -61.796428,
        "name": "Antigua and Barbuda"
    },
    "AI": {
        "lat": 18.220554,
        "long": -63.068615,
        "name": "Anguilla"
    },
    "AL": {
        "lat": 41.153332,
        "long": 20.168331,
        "name": "Albania"
    },
    "AM": {
        "lat": 40.069099,
        "long": 45.038189,
        "name": "Armenia"
    },
    "AN": {
        "lat": 12.226079,
        "long": -69.060087,
        "name": "Netherlands Antilles"
    },
    "AO": {
        "lat": -11.202692,
        "long": 17.873887,
        "name": "Angola"
    },
    "AQ": {
        "lat": -75.250973,
        "long": -0.071389,
        "name": "Antarctica"
    },
    "AR": {
        "lat": -38.416097,
        "long": -63.616672,
        "name": "Argentina"
    },
    "AS": {
        "lat": -14.270972,
        "long": -170.132217,
        "name": "American Samoa"
    },
    "AT": {
        "lat": 47.516231,
        "long": 14.550072,
        "name": "Austria"
    },
    "AU": {
        "lat": -25.274398,
        "long": 133.775136,
        "name": "Australia"
    },
    "AW": {
        "lat": 12.52111,
        "long": -69.968338,
        "name": "Aruba"
    },
    "AZ": {
        "lat": 40.143105,
        "long": 47.576927,
        "name": "Azerbaijan"
    },
    "BA": {
        "lat": 43.915886,
        "long": 17.679076,
        "name": "Bosnia and Herzegovina"
    },
    "BB": {
        "lat": 13.193887,
        "long": -59.543198,
        "name": "Barbados"
    },
    "BD": {
        "lat": 23.684994,
        "long": 90.356331,
        "name": "Bangladesh"
    },
    "BE": {
        "lat": 50.503887,
        "long": 4.469936,
        "name": "Belgium"
    },
    "BF": {
        "lat": 12.238333,
        "long": -1.561593,
        "name": "Burkina Faso"
    },
    "BG": {
        "lat": 42.733883,
        "long": 25.48583,
        "name": "Bulgaria"
    },
    "BH": {
        "lat": 25.930414,
        "long": 50.637772,
        "name": "Bahrain"
    },
    "BI": {
        "lat": -3.373056,
        "long": 29.918886,
        "name": "Burundi"
    },
    "BJ": {
        "lat": 9.30769,
        "long": 2.315834,
        "name": "Benin"
    },
    "BM": {
        "lat": 32.321384,
        "long": -64.75737,
        "name": "Bermuda"
    },
    "BN": {
        "lat": 4.535277,
        "long": 114.727669,
        "name": "Brunei"
    },
    "BO": {
        "lat": -16.290154,
        "long": -63.588653,
        "name": "Bolivia"
    },
    "BR": {
        "lat": -14.235004,
        "long": -51.92528,
        "name": "Brazil"
    },
    "BS": {
        "lat": 25.03428,
        "long": -77.39628,
        "name": "Bahamas"
    },
    "BT": {
        "lat": 27.514162,
        "long": 90.433601,
        "name": "Bhutan"
    },
    "BV": {
        "lat": -54.423199,
        "long": 3.413194,
        "name": "Bouvet Island"
    },
    "BW": {
        "lat": -22.328474,
        "long": 24.684866,
        "name": "Botswana"
    },
    "BY": {
        "lat": 53.709807,
        "long": 27.953389,
        "name": "Belarus"
    },
    "BZ": {
        "lat": 17.189877,
        "long": -88.49765,
        "name": "Belize"
    },
    "CA": {
        "lat": 56.130366,
        "long": -106.346771,
        "name": "Canada"
    },
    "CC": {
        "lat": -12.164165,
        "long": 96.870956,
        "name": "Cocos [Keeling] Islands"
    },
    "CD": {
        "lat": -4.038333,
        "long": 21.758664,
        "name": "Congo [DRC]"
    },
    "CF": {
        "lat": 6.611111,
        "long": 20.939444,
        "name": "Central African Republic"
    },
    "CG": {
        "lat": -0.228021,
        "long": 15.827659,
        "name": "Congo [Republic]"
    },
    "CH": {
        "lat": 46.818188,
        "long": 8.227512,
        "name": "Switzerland"
    },
    "CI": {
        "lat": 7.539989,
        "long": -5.54708,
        "name": "Côte d'Ivoire"
    },
    "CK": {
        "lat": -21.236736,
        "long": -159.777671,
        "name": "Cook Islands"
    },
    "CL": {
        "lat": -35.675147,
        "long": -71.542969,
        "name": "Chile"
    },
    "CM": {
        "lat": 7.369722,
        "long": 12.354722,
        "name": "Cameroon"
    },
    "CN": {
        "lat": 35.86166,
        "long": 104.195397,
        "name": "China"
    },
    "CO": {
        "lat": 4.570868,
        "long": -74.297333,
        "name": "Colombia"
    },
    "CR": {
        "lat": 9.748917,
        "long": -83.753428,
        "name": "Costa Rica"
    },
    "CU": {
        "lat": 21.521757,
        "long": -77.781167,
        "name": "Cuba"
    },
    "CV": {
        "lat": 16.002082,
        "long": -24.013197,
        "name": "Cape Verde"
    },
    "CX": {
        "lat": -10.447525,
        "long": 105.690449,
        "name": "Christmas Island"
    },
    "CY": {
        "lat": 35.126413,
        "long": 33.429859,
        "name": "Cyprus"
    },
    "CZ": {
        "lat": 49.817492,
        "long": 15.472962,
        "name": "Czech Republic"
    },
    "DE": {
        "lat": 51.165691,
        "long": 10.451526,
        "name": "Germany"
    },
    "DJ": {
        "lat": 11.825138,
        "long": 42.590275,
        "name": "Djibouti"
    },
    "DK": {
        "lat": 56.26392,
        "long": 9.501785,
        "name": "Denmark"
    },
    "DM": {
        "lat": 15.414999,
        "long": -61.370976,
        "name": "Dominica"
    },
    "DO": {
        "lat": 18.735693,
        "long": -70.162651,
        "name": "Dominican Republic"
    },
    "DZ": {
        "lat": 28.033886,
        "long": 1.659626,
        "name": "Algeria"
    },
    "EC": {
        "lat": -1.831239,
        "long": -78.183406,
        "name": "Ecuador"
    },
    "EE": {
        "lat": 58.595272,
        "long": 25.013607,
        "name": "Estonia"
    },
    "EG": {
        "lat": 26.820553,
        "long": 30.802498,
        "name": "Egypt"
    },
    "EH": {
        "lat": 24.215527,
        "long": -12.885834,
        "name": "Western Sahara"
    },
    "ER": {
        "lat": 15.179384,
        "long": 39.782334,
        "name": "Eritrea"
    },
    "ES": {
        "lat": 40.463667,
        "long": -3.74922,
        "name": "Spain"
    },
    "ET": {
        "lat": 9.145,
        "long": 40.489673,
        "name": "Ethiopia"
    },
    "FI": {
        "lat": 61.92411,
        "long": 25.748151,
        "name": "Finland"
    },
    "FJ": {
        "lat": -16.578193,
        "long": 179.414413,
        "name": "Fiji"
    },
    "FK": {
        "lat": -51.796253,
        "long": -59.523613,
        "name": "Falkland Islands [Islas Malvinas]"
    },
    "FM": {
        "lat": 7.425554,
        "long": 150.550812,
        "name": "Micronesia"
    },
    "FO": {
        "lat": 61.892635,
        "long": -6.911806,
        "name": "Faroe Islands"
    },
    "FR": {
        "lat": 46.227638,
        "long": 2.213749,
        "name": "France"
    },
    "GA": {
        "lat": -0.803689,
        "long": 11.609444,
        "name": "Gabon"
    },
    "GB": {
        "lat": 55.378051,
        "long": -3.435973,
        "name": "United Kingdom"
    },
    "GD": {
        "lat": 12.262776,
        "long": -61.604171,
        "name": "Grenada"
    },
    "GE": {
        "lat": 42.315407,
        "long": 43.356892,
        "name": "Georgia"
    },
    "GF": {
        "lat": 3.933889,
        "long": -53.125782,
        "name": "French Guiana"
    },
    "GG": {
        "lat": 49.465691,
        "long": -2.585278,
        "name": "Guernsey"
    },
    "GH": {
        "lat": 7.946527,
        "long": -1.023194,
        "name": "Ghana"
    },
    "GI": {
        "lat": 36.137741,
        "long": -5.345374,
        "name": "Gibraltar"
    },
    "GL": {
        "lat": 71.706936,
        "long": -42.604303,
        "name": "Greenland"
    },
    "GM": {
        "lat": 13.443182,
        "long": -15.310139,
        "name": "Gambia"
    },
    "GN": {
        "lat": 9.945587,
        "long": -9.696645,
        "name": "Guinea"
    },
    "GP": {
        "lat": 16.995971,
        "long": -62.067641,
        "name": "Guadeloupe"
    },
    "GQ": {
        "lat": 1.650801,
        "long": 10.267895,
        "name": "Equatorial Guinea"
    },
    "GR": {
        "lat": 39.074208,
        "long": 21.824312,
        "name": "Greece"
    },
    "GS": {
        "lat": -54.429579,
        "long": -36.587909,
        "name": "South Georgia and the South Sandwich Islands"
    },
    "GT": {
        "lat": 15.783471,
        "long": -90.230759,
        "name": "Guatemala"
    },
    "GU": {
        "lat": 13.444304,
        "long": 144.793731,
        "name": "Guam"
    },
    "GW": {
        "lat": 11.803749,
        "long": -15.180413,
        "name": "Guinea-Bissau"
    },
    "GY": {
        "lat": 4.860416,
        "long": -58.93018,
        "name": "Guyana"
    },
    "GZ": {
        "lat": 31.354676,
        "long": 34.308825,
        "name": "Gaza Strip"
    },
    "HK": {
        "lat": 22.396428,
        "long": 114.109497,
        "name": "Hong Kong"
    },
    "HM": {
        "lat": -53.08181,
        "long": 73.504158,
        "name": "Heard Island and McDonald Islands"
    },
    "HN": {
        "lat": 15.199999,
        "long": -86.241905,
        "name": "Honduras"
    },
    "HR": {
        "lat": 45.1,
        "long": 15.2,
        "name": "Croatia"
    },
    "HT": {
        "lat": 18.971187,
        "long": -72.285215,
        "name": "Haiti"
    },
    "HU": {
        "lat": 47.162494,
        "long": 19.503304,
        "name": "Hungary"
    },
    "ID": {
        "lat": -0.789275,
        "long": 113.921327,
        "name": "Indonesia"
    },
    "IE": {
        "lat": 53.41291,
        "long": -8.24389,
        "name": "Ireland"
    },
    "IL": {
        "lat": 31.046051,
        "long": 34.851612,
        "name": "Israel"
    },
    "IM": {
        "lat": 54.236107,
        "long": -4.548056,
        "name": "Isle of Man"
    },
    "IN": {
        "lat": 20.593684,
        "long": 78.96288,
        "name": "India"
    },
    "IO": {
        "lat": -6.343194,
        "long": 71.876519,
        "name": "British Indian Ocean Territory"
    },
    "IQ": {
        "lat": 33.223191,
        "long": 43.679291,
        "name": "Iraq"
    },
    "IR": {
        "lat": 32.427908,
        "long": 53.688046,
        "name": "Iran"
    },
    "IS": {
        "lat": 64.963051,
        "long": -19.020835,
        "name": "Iceland"
    },
    "IT": {
        "lat": 41.87194,
        "long": 12.56738,
        "name": "Italy"
    },
    "JE": {
        "lat": 49.214439,
        "long": -2.13125,
        "name": "Jersey"
    },
    "JM": {
        "lat": 18.109581,
        "long": -77.297508,
        "name": "Jamaica"
    },
    "JO": {
        "lat": 30.585164,
        "long": 36.238414,
        "name": "Jordan"
    },
    "JP": {
        "lat": 36.204824,
        "long": 138.252924,
        "name": "Japan"
    },
    "KE": {
        "lat": -0.023559,
        "long": 37.906193,
        "name": "Kenya"
    },
    "KG": {
        "lat": 41.20438,
        "long": 74.766098,
        "name": "Kyrgyzstan"
    },
    "KH": {
        "lat": 12.565679,
        "long": 104.990963,
        "name": "Cambodia"
    },
    "KI": {
        "lat": -3.370417,
        "long": -168.734039,
        "name": "Kiribati"
    },
    "KM": {
        "lat": -11.875001,
        "long": 43.872219,
        "name": "Comoros"
    },
    "KN": {
        "lat": 17.357822,
        "long": -62.782998,
        "name": "Saint Kitts and Nevis"
    },
    "KP": {
        "lat": 40.339852,
        "long": 127.510093,
        "name": "North Korea"
    },
    "KR": {
        "lat": 35.907757,
        "long": 127.766922,
        "name": "South Korea"
    },
    "KW": {
        "lat": 29.31166,
        "long": 47.481766,
        "name": "Kuwait"
    },
    "KY": {
        "lat": 19.513469,
        "long": -80.566956,
        "name": "Cayman Islands"
    },
    "KZ": {
        "lat": 48.019573,
        "long": 66.923684,
        "name": "Kazakhstan"
    },
    "LA": {
        "lat": 19.85627,
        "long": 102.495496,
        "name": "Laos"
    },
    "LB": {
        "lat": 33.854721,
        "long": 35.862285,
        "name": "Lebanon"
    },
    "LC": {
        "lat": 13.909444,
        "long": -60.978893,
        "name": "Saint Lucia"
    },
    "LI": {
        "lat": 47.166,
        "long": 9.555373,
        "name": "Liechtenstein"
    },
    "LK": {
        "lat": 7.873054,
        "long": 80.771797,
        "name": "Sri Lanka"
    },
    "LR": {
        "lat": 6.428055,
        "long": -9.429499,
        "name": "Liberia"
    },
    "LS": {
        "lat": -29.609988,
        "long": 28.233608,
        "name": "Lesotho"
    },
    "LT": {
        "lat": 55.169438,
        "long": 23.881275,
        "name": "Lithuania"
    },
    "LU": {
        "lat": 49.815273,
        "long": 6.129583,
        "name": "Luxembourg"
    },
    "LV": {
        "lat": 56.879635,
        "long": 24.603189,
        "name": "Latvia"
    },
    "LY": {
        "lat": 26.3351,
        "long": 17.228331,
        "name": "Libya"
    },
    "MA": {
        "lat": 31.791702,
        "long": -7.09262,
        "name": "Morocco"
    },
    "MC": {
        "lat": 43.750298,
        "long": 7.412841,
        "name": "Monaco"
    },
    "MD": {
        "lat": 47.411631,
        "long": 28.369885,
        "name": "Moldova"
    },
    "ME": {
        "lat": 42.708678,
        "long": 19.37439,
        "name": "Montenegro"
    },
    "MG": {
        "lat": -18.766947,
        "long": 46.869107,
        "name": "Madagascar"
    },
    "MH": {
        "lat": 7.131474,
        "long": 171.184478,
        "name": "Marshall Islands"
    },
    "MK": {
        "lat": 41.608635,
        "long": 21.745275,
        "name": "Macedonia [FYROM]"
    },
    "ML": {
        "lat": 17.570692,
        "long": -3.996166,
        "name": "Mali"
    },
    "MM": {
        "lat": 21.913965,
        "long": 95.956223,
        "name": "Myanmar [Burma]"
    },
    "MN": {
        "lat": 46.862496,
        "long": 103.846656,
        "name": "Mongolia"
    },
    "MO": {
        "lat": 22.198745,
        "long": 113.543873,
        "name": "Macau"
    },
    "MP": {
        "lat": 17.33083,
        "long": 145.38469,
        "name": "Northern Mariana Islands"
    },
    "MQ": {
        "lat": 14.641528,
        "long": -61.024174,
        "name": "Martinique"
    },
    "MR": {
        "lat": 21.00789,
        "long": -10.940835,
        "name": "Mauritania"
    },
    "MS": {
        "lat": 16.742498,
        "long": -62.187366,
        "name": "Montserrat"
    },
    "MT": {
        "lat": 35.937496,
        "long": 14.375416,
        "name": "Malta"
    },
    "MU": {
        "lat": -20.348404,
        "long": 57.552152,
        "name": "Mauritius"
    },
    "MV": {
        "lat": 3.202778,
        "long": 73.22068,
        "name": "Maldives"
    },
    "MW": {
        "lat": -13.254308,
        "long": 34.301525,
        "name": "Malawi"
    },
    "MX": {
        "lat": 23.634501,
        "long": -102.552784,
        "name": "Mexico"
    },
    "MY": {
        "lat": 4.210484,
        "long": 101.975766,
        "name": "Malaysia"
    },
    "MZ": {
        "lat": -18.665695,
        "long": 35.529562,
        "name": "Mozambique"
    },
    "NA": {
        "lat": -22.95764,
        "long": 18.49041,
        "name": "Namibia"
    },
    "NC": {
        "lat": -20.904305,
        "long": 165.618042,
        "name": "New Caledonia"
    },
    "NE": {
        "lat": 17.607789,
        "long": 8.081666,
        "name": "Niger"
    },
    "NF": {
        "lat": -29.040835,
        "long": 167.954712,
        "name": "Norfolk Island"
    },
    "NG": {
        "lat": 9.081999,
        "long": 8.675277,
        "name": "Nigeria"
    },
    "NI": {
        "lat": 12.865416,
        "long": -85.207229,
        "name": "Nicaragua"
    },
    "NL": {
        "lat": 52.132633,
        "long": 5.291266,
        "name": "Netherlands"
    },
    "NO": {
        "lat": 60.472024,
        "long": 8.468946,
        "name": "Norway"
    },
    "NP": {
        "lat": 28.394857,
        "long": 84.124008,
        "name": "Nepal"
    },
    "NR": {
        "lat": -0.522778,
        "long": 166.931503,
        "name": "Nauru"
    },
    "NU": {
        "lat": -19.054445,
        "long": -169.867233,
        "name": "Niue"
    },
    "NZ": {
        "lat": -40.900557,
        "long": 174.885971,
        "name": "New Zealand"
    },
    "OM": {
        "lat": 21.512583,
        "long": 55.923255,
        "name": "Oman"
    },
    "PA": {
        "lat": 8.537981,
        "long": -80.782127,
        "name": "Panama"
    },
    "PE": {
        "lat": -9.189967,
        "long": -75.015152,
        "name": "Peru"
    },
    "PF": {
        "lat": -17.679742,
        "long": -149.406843,
        "name": "French Polynesia"
    },
    "PG": {
        "lat": -6.314993,
        "long": 143.95555,
        "name": "Papua New Guinea"
    },
    "PH": {
        "lat": 12.879721,
        "long": 121.774017,
        "name": "Philippines"
    },
    "PK": {
        "lat": 30.375321,
        "long": 69.345116,
        "name": "Pakistan"
    },
    "PL": {
        "lat": 51.919438,
        "long": 19.145136,
        "name": "Poland"
    },
    "PM": {
        "lat": 46.941936,
        "long": -56.27111,
        "name": "Saint Pierre and Miquelon"
    },
    "PN": {
        "lat": -24.703615,
        "long": -127.439308,
        "name": "Pitcairn Islands"
    },
    "PR": {
        "lat": 18.220833,
        "long": -66.590149,
        "name": "Puerto Rico"
    },
    "PS": {
        "lat": 31.952162,
        "long": 35.233154,
        "name": "Palestinian Territories"
    },
    "PT": {
        "lat": 39.399872,
        "long": -8.224454,
        "name": "Portugal"
    },
    "PW": {
        "lat": 7.51498,
        "long": 134.58252,
        "name": "Palau"
    },
    "PY": {
        "lat": -23.442503,
        "long": -58.443832,
        "name": "Paraguay"
    },
    "QA": {
        "lat": 25.354826,
        "long": 51.183884,
        "name": "Qatar"
    },
    "RE": {
        "lat": -21.115141,
        "long": 55.536384,
        "name": "Réunion"
    },
    "RO": {
        "lat": 45.943161,
        "long": 24.96676,
        "name": "Romania"
    },
    "RS": {
        "lat": 44.016521,
        "long": 21.005859,
        "name": "Serbia"
    },
    "RU": {
        "lat": 61.52401,
        "long": 105.318756,
        "name": "Russia"
    },
    "RW": {
        "lat": -1.940278,
        "long": 29.873888,
        "name": "Rwanda"
    },
    "SA": {
        "lat": 23.885942,
        "long": 45.079162,
        "name": "Saudi Arabia"
    },
    "SB": {
        "lat": -9.64571,
        "long": 160.156194,
        "name": "Solomon Islands"
    },
    "SC": {
        "lat": -4.679574,
        "long": 55.491977,
        "name": "Seychelles"
    },
    "SD": {
        "lat": 12.862807,
        "long": 30.217636,
        "name": "Sudan"
    },
    "SE": {
        "lat": 60.128161,
        "long": 18.643501,
        "name": "Sweden"
    },
    "SG": {
        "lat": 1.352083,
        "long": 103.819836,
        "name": "Singapore"
    },
    "SH": {
        "lat": -24.143474,
        "long": -10.030696,
        "name": "Saint Helena"
    },
    "SI": {
        "lat": 46.151241,
        "long": 14.995463,
        "name": "Slovenia"
    },
    "SJ": {
        "lat": 77.553604,
        "long": 23.670272,
        "name": "Svalbard and Jan Mayen"
    },
    "SK": {
        "lat": 48.669026,
        "long": 19.699024,
        "name": "Slovakia"
    },
    "SL": {
        "lat": 8.460555,
        "long": -11.779889,
        "name": "Sierra Leone"
    },
    "SM": {
        "lat": 43.94236,
        "long": 12.457777,
        "name": "San Marino"
    },
    "SN": {
        "lat": 14.497401,
        "long": -14.452362,
        "name": "Senegal"
    },
    "SO": {
        "lat": 5.152149,
        "long": 46.199616,
        "name": "Somalia"
    },
    "SR": {
        "lat": 3.919305,
        "long": -56.027783,
        "name": "Suriname"
    },
    "ST": {
        "lat": 0.18636,
        "long": 6.613081,
        "name": "São Tomé and Príncipe"
    },
    "SV": {
        "lat": 13.794185,
        "long": -88.89653,
        "name": "El Salvador"
    },
    "SY": {
        "lat": 34.802075,
        "long": 38.996815,
        "name": "Syria"
    },
    "SZ": {
        "lat": -26.522503,
        "long": 31.465866,
        "name": "Swaziland"
    },
    "TC": {
        "lat": 21.694025,
        "long": -71.797928,
        "name": "Turks and Caicos Islands"
    },
    "TD": {
        "lat": 15.454166,
        "long": 18.732207,
        "name": "Chad"
    },
    "TF": {
        "lat": -49.280366,
        "long": 69.348557,
        "name": "French Southern Territories"
    },
    "TG": {
        "lat": 8.619543,
        "long": 0.824782,
        "name": "Togo"
    },
    "TH": {
        "lat": 15.870032,
        "long": 100.992541,
        "name": "Thailand"
    },
    "TJ": {
        "lat": 38.861034,
        "long": 71.276093,
        "name": "Tajikistan"
    },
    "TK": {
        "lat": -8.967363,
        "long": -171.855881,
        "name": "Tokelau"
    },
    "TL": {
        "lat": -8.874217,
        "long": 125.727539,
        "name": "Timor-Leste"
    },
    "TM": {
        "lat": 38.969719,
        "long": 59.556278,
        "name": "Turkmenistan"
    },
    "TN": {
        "lat": 33.886917,
        "long": 9.537499,
        "name": "Tunisia"
    },
    "TO": {
        "lat": -21.178986,
        "long": -175.198242,
        "name": "Tonga"
    },
    "TR": {
        "lat": 38.963745,
        "long": 35.243322,
        "name": "Turkey"
    },
    "TT": {
        "lat": 10.691803,
        "long": -61.222503,
        "name": "Trinidad and Tobago"
    },
    "TV": {
        "lat": -7.109535,
        "long": 177.64933,
        "name": "Tuvalu"
    },
    "TW": {
        "lat": 23.69781,
        "long": 120.960515,
        "name": "Taiwan"
    },
    "TZ": {
        "lat": -6.369028,
        "long": 34.888822,
        "name": "Tanzania"
    },
    "UA": {
        "lat": 48.379433,
        "long": 31.16558,
        "name": "Ukraine"
    },
    "UG": {
        "lat": 1.373333,
        "long": 32.290275,
        "name": "Uganda"
    },
    "UM": {
        "lat": null,
        "long": null,
        "name": "U.S. Minor Outlying Islands"
    },
    "US": {
        "lat": 37.09024,
        "long": -95.712891,
        "name": "United States"
    },
    "UY": {
        "lat": -32.522779,
        "long": -55.765835,
        "name": "Uruguay"
    },
    "UZ": {
        "lat": 41.377491,
        "long": 64.585262,
        "name": "Uzbekistan"
    },
    "VA": {
        "lat": 41.902916,
        "long": 12.453389,
        "name": "Vatican City"
    },
    "VC": {
        "lat": 12.984305,
        "long": -61.287228,
        "name": "Saint Vincent and the Grenadines"
    },
    "VE": {
        "lat": 6.42375,
        "long": -66.58973,
        "name": "Venezuela"
    },
    "VG": {
        "lat": 18.420695,
        "long": -64.639968,
        "name": "British Virgin Islands"
    },
    "VI": {
        "lat": 18.335765,
        "long": -64.896335,
        "name": "U.S. Virgin Islands"
    },
    "VN": {
        "lat": 14.058324,
        "long": 108.277199,
        "name": "Vietnam"
    },
    "VU": {
        "lat": -15.376706,
        "long": 166.959158,
        "name": "Vanuatu"
    },
    "WF": {
        "lat": -13.768752,
        "long": -177.156097,
        "name": "Wallis and Futuna"
    },
    "WS": {
        "lat": -13.759029,
        "long": -172.104629,
        "name": "Samoa"
    },
    "XK": {
        "lat": 42.602636,
        "long": 20.902977,
        "name": "Kosovo"
    },
    "YE": {
        "lat": 15.552727,
        "long": 48.516388,
        "name": "Yemen"
    },
    "YT": {
        "lat": -12.8275,
        "long": 45.166244,
        "name": "Mayotte"
    },
    "ZA": {
        "lat": -30.559482,
        "long": 22.937506,
        "name": "South Africa"
    },
    "ZM": {
        "lat": -13.133897,
        "long": 27.849332,
        "name": "Zambia"
    },
    "ZW": {
        "lat": -19.015438,
        "long": 29.154857,
        "name": "Zimbabwe"
    }
}

const states = {
    US: {
        OH: {
            lat: 40.367474, 
            long: -82.996216
        },
        VA: {
            lat: 37.926868,
            long: -78.024902
        }
    }
}

const getClosestRegion = () => {
    let currentLocale = skapi.connection.locale;
    let res = '';

    if(regions[skapi.connection.locale]) {
        res = skapi.connection.locale;
    } else {
        let difference = null;
        for (let region in regions) {
            let distance = calculateDistance(countries[currentLocale], countries[region]);
            if(difference == null || distance < difference) {
                difference = distance;
                res = region;
            }
        }
    }
    
    if(res === 'US') {
        let country = res;
        let difference = null;
        for (let state in states[country]) {
            let distance = calculateDistance(states[country][state], countries[currentLocale]);
            if(difference == null || distance < difference) {
                difference = distance;
                res = state;
            }
        }

        return regions[country][res];
    }

    return regions[res];
}
const calculateDistance = (locale, region) => {
    const R = 6371e3; // metres
    const φ1 = (locale.lat * Math.PI) / 180; // φ, λ in radians
    const φ2 = (region.lat * Math.PI) / 180;
    const Δφ = ((region.lat - locale.lat) * Math.PI) / 180;
    const Δλ = ((region.long - locale.long) * Math.PI) / 180;

    const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres

    return d;
}

const createNewService = async () => {
    if(isCreatingService.value) { return false; }
    const serviceLocale = getClosestRegion();
    isCreatingService.value = true;
    let res = await skapi.createService({region: serviceLocale, name: serviceName.value});
    router.push(`/dashboard/${res.service}`);
}

</script>

<style lang="less" scoped>
@import '@/assets/variables.less';
.overlay-container {
    background-color: #505050;
    border: 1px solid #808080;
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.25);
    color: #fff;
    text-align: center;
    padding: 40px;
    width: 500px;
    max-width: 100%;
    border-radius: 8px;

    &-title {
        font-weight: bold;
        font-size: 28px;
        margin-bottom: 40px;
    }

    &-text {
        color: rgba(255, 255, 255, 0.85);
        margin: 0 0 28px 0;
        line-height: 1.5;
    }

    sui-input {
        display: block;
        margin-bottom: 40px;
        width: 100%;
        background-color: rgba(255, 255, 255, .08);

        input::placeholder {
            color: rgba(255, 255, 255, .4);
        }

        &[type=submit] {    
            display: inline-block;        
            width: unset;
        }
    }

    @media @tablet {
        width: 100%;
        max-width: unset;
        border-radius: 0;
        border: none;
        box-shadow: none;
        background: transparent;
        padding: 0;
        margin-top: var(--head-space);

        &-text {
            text-align: left;
        }
    }
}
</style>