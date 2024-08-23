<template>
    <div align="center">
      <!-- KULLANICI GİRİŞ FORMU -->
      <q-card class="q-pb-md q-ma-md" style="width: 450px">
        <q-card-section class="bg-orange-9">
          <div class="text-h6" style="color:'White'">
            AYNİYAT
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none" align="center">
          <div class="q-pa-md" style="max-width: 420px">
            <q-form @submit="login()" @reset="resetle()" class="q-gutter-md">
              <q-input filled v-model="kullaniciObj.kullaniciAdi"
                label="Kullanıcı Adı" lazy-rules :rules="[(val) => val!=null || 'Kullanıcı Adı Giriniz']" />
              <q-input type="password" filled v-model="kullaniciObj.parola" label="Kullanıcı Şifresi *" lazy-rules
                :rules="[(val) => val!=null || 'Paroola Giriniz']" />
  
              <div align="center">
                <q-btn type="reset" label="TEMİZLE" color="primary" flat class="q-ml-sm" v-close-popup />
                <q-btn type="submit" label="GİRİŞ" color="primary" />
              </div>
            </q-form>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </template>
  
  <script>
  import { api } from 'boot/axios';
  import myMixin from "app/src/stores/mixin.js";
  import { useStore } from 'app/src/stores/store.js';
  const store = useStore();
  
  export default {
    mixins: [myMixin],
  
    data() {
      return {
      
        kullaniciObj: {
        kullaniciAdi: null,
        parola: null  
        },
        submitted: false,
      };
    },
    computed: {
  
    },
    methods: {
      
      resetle() {
        this.kullaniciObj.kullaniciAdi=null;
        this.kullaniciObj.parola=null;
      },
      login(e) {
        this.submitted = true;
        api.post("kullanici/login", this.kullaniciObj)
          .then((resp) => {
            console.log(resp.data.ad);
            // // kullanıcı bilgileri saklanıyor
             localStorage.setItem("kullaniciId", resp.data.kullaniciId);
            localStorage.setItem("eposta", resp.data.eposta);
            localStorage.setItem("token", resp.data.token);
            localStorage.setItem("rolId", resp.data.rolId);
            localStorage.setItem("adSoyad",resp.data.ad+" "+resp.data.soyad)
  
            api.defaults.headers.common['Authorization'] =
              "Bearer " + resp.data.token;
         
            // // Kullanıcı bilgileri alındıktan sonra ana sayfaya gidiliyor
            window.location.href = "#/zimmetbazli";
          })
          .catch(function (error) {
            console.log("hata" + error.response);
            // localStorage.clear();
            // this.resetle();
            // alert("Giriş Bilgileri Hatalı!");
          });
      },
    },
    mounted() {
  
    },
    created() { },
  };
  </script>