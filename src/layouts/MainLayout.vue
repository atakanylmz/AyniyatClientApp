<template>
  <div class="q-pa-md">
    <q-toolbar class="bg-orange-9 text-white shadow-2 rounded-borders ">
      <q-tabs v-model="tab" shrink>
        <q-tab name="tab1" label="ZİMMET BAZLI LİSTE" />
        <q-tab name="tab2" label="PERSONEL LİSTESİ" />
      </q-tabs>
  <q-space></q-space>
    <q-avatar>
      <img src="~assets/KgmLogo.png">
     </q-avatar >
     <q-toolbar-title>
    AYNİYAT 
   </q-toolbar-title> 
  <q-space></q-space>

{{ aktifKullanici.adSoyad }}
      <q-btn flat dense round icon="logout" @mouseover="showText = true" @mouseleave="showText = false" @click="logout()">
          <div class="text-subtitle2 flex flex-center text-grey-8 bg-orange-1" v-show="showText">
            ÇIKIŞ
          </div>
        </q-btn>
      <!--
        notice shrink property since we are placing it
        as child of QToolbar
      -->
  
    </q-toolbar>
  </div>
</template>
<script>

import myMixin from 'src/stores/mixin.js'


export default {
  mixins: [myMixin],
  name: "MainLayout",
  data() {
    return {

      //showText: false,
    };
  },
  methods: {

    logout() {
      localStorage.clear();
      window.location.href = "#/";
    },
    
  },
  mounted() { },
  created() { },
};
</script>
