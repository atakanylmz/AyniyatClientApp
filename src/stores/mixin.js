import { useStore } from 'app/src/stores/store.js';
const store = useStore();

function yilOlustur(yilMiktar) {
    var max = new Date().getFullYear()
    var min = max - yilMiktar
    var years = []
  
    for (var i = max; i >= min; i--) {
      years.push(i);
    }
    return years.map(yil=>({"id":yil,"ad":yil}));
  }


const myMixin = {
    data() {
        return {
            ays: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
      ayKisas: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
      guns: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
      gunKisas: ['Pts', 'Sal', 'Çar', 'Per', 'Cum', 'Cts', 'Paz'],
      gunEngs: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
      gunKisaEngs: ['Paz', 'Pts', 'Sal', 'Çar', 'Per', 'Cum', 'Cts'],
      yils:yilOlustur(30),
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
            subelerDD: store.$state.subeler,
           
        }
    },
    methods: {
        async fetchSubeler() {
           this.subelerDD= await this.localStore.fetchSubeler(); // Mixin içinde store'dan units'i güncelleyin
        },
   
    }
}

export default myMixin