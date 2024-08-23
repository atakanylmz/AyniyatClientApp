import { defineStore } from 'pinia';
import { api } from 'boot/axios'

export const useStore = defineStore('main', {
  state: () => ({
    subeler: [],
  }),
  actions: {
    
    async fetchSubeler() {
      // API'den verileri alın, örneğin fetchBirimler adlı bir API çağrısı yapın
      const response = await api.get("acilirliste/SubeListesiGetir");

      this.subeler = response.data;
    },
    
  },

});