import { useStore } from 'app/src/stores/store.js';
const store = useStore();

const myMixin = {
    data() {
        return {
            aktifKullanici: {
                kullaniciId: localStorage.getItem('kullaniciId'),
                adSoyad: localStorage.getItem('adSoyad'),
                rolId: parseInt(localStorage.getItem('rolId')),
            },
           
            eRol: {
                sisYon: 1,
                admin: 2,
                personel: 3,
                ortakAlan: 4,
            },
           
            pop_baslik: null,
            pop_kayit: false,
         
            pop_mesaj: "",
            showText:false,
            araText: "",
            localStore: useStore(),
            subeler: store.$state.subeler,
        }
    },
    methods: {
        async fetchSubeler() {
            await this.localStore.fetchSubeler(); // Mixin içinde store'dan units'i güncelleyin
        },
   
    }
}

export default myMixin