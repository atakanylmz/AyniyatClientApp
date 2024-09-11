<template>
  <div class="text-center">

      <!--KULLANICI EKLE / DEĞİŞTİR POP UP-->
      <q-dialog v-model="pop_kayit" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-white text-orange-9" style="max-width: 700px; width: 600px">
              <q-card-section>
                  <div class="text-h6">{{ pop_baslik }} </div>
                  <hr style="background-color: #008080; border-style: none; height: 1px" />
              </q-card-section>
              <q-card-section class="q-pt-none">
                  <div class="q-pa-md" style="max-width: 700px">
                      <q-form @submit="kullaniciKaydet()" @reset="kullaniciObjeTemizle()">
                          <!-- kimlik bilgileri -->

                          <div class="row">
                            <q-input filled class="col-6 q-pl-md" v-model="kullaniciObj.ad"
                                  label="Ad *" lazy-rules
                                  :rules="[(val) =>(val!=null&&val.trim().length>1)|| 'Personel adı en az 2 karakter olmalıdır!']"
                                  />
                                  <q-input filled class="col-6 q-pl-md" v-model="kullaniciObj.soyad"
                                  label="Soyad *" lazy-rules
                                  :rules="[(val) => (val!=null&&val.trim().length>1)|| 'Personel soyadı en az 2 karakter olmalıdır!']"
                                  />

                                  <q-input filled class="col-6 q-pl-md" v-model="kullaniciObj.unvan"
                                  label="Ünvan" lazy-rules
                                  :rules="[(val) => (val==null||val.trim().length>1)|| 'Personel ünvanı en az 2 karakter olmalıdır!']"
                                  />
                                  <q-input filled class="col-6 q-pl-md" v-model="kullaniciObj.eposta"
                                  label="Eposta" lazy-rules  type="email" 
                                  :rules="[(val) => (val==null||val.trim().length>1)|| 'Eposta en az 2 karakter olmalıdır!']"
                                  />

                                 <!-- şube listesi  -->
                                <q-select filled class="col-12 q-pl-md" v-model="kullaniciObj.subeId" color="orange-9"
                                  label="Şube Müdürlüğü" :options="subelerDD" option-value="id" option-label="text"
                                  emit-value map-options transition-show="jump-up" transition-hide="jump-up"
                                  lazy-rules :rules="[true]" />

                                  <q-toggle style="color: grey; text-align: left" class="col-6" v-model="kullaniciObj.aktifmi"
                                  checked-icon="check" color="green" label="Aktif mi?" unchecked-icon="clear" /> 

                          </div>

                          <div class="row">
                              <p class="q-ma-md">(*) Zorunlu alanlar</p>
                          </div>
                          <div align="right">
                              <q-btn label="Vazgeç" type="reset" color="orange-9" flat class="q-ml-sm"
                                  v-close-popup />
                              <q-btn label="Kaydet" color="orange-9" type="submit" />
                          </div>
                      </q-form>
                  </div>
              </q-card-section>
          </q-card>
      </q-dialog>

      <!--KULLANICI ANA EKRAN-->
      <div class="q-pa-md">
          <div class="row q-ml-sm">

              <div class="col-2">
                  <div class="q-pa-md">
                      <q-btn color="white" text-color="orange-9" @click="kullaniciEklePopupAc()">
                          <q-icon name="person_add" font-weight="300" />&nbsp;YENİ
                      </q-btn>
                  </div>
              </div>

              <div class="col-4 ">
                <!-- şube listesi  -->
                <q-select filled class="col-3 q-pl-md" v-model="kriterObj.subeId" color="orange-9"
                                  label="Şube Müdürlüğü" :options="subelerDD" option-value="id" option-label="text"
                                  emit-value map-options transition-show="jump-up" transition-hide="jump-up"
                                  lazy-rules :rules="[true]" clearable />
              </div>
             
              <div class="col-2  q-pl-md ">
                  <q-input outlined bottom-slots v-model="kriterObj.araText" label="Arama">
                  </q-input>
              </div>
              <div class="col-2 q-pl-md">
                <q-toggle style="color: grey; text-align: left" class="col-6" v-model="kriterObj.aktifmi"
                checked-icon="check" color="green" :label="(kriterObj.aktifmi)?'Aktif Kullanıcılar':'Pasif Kullanıcılar'" unchecked-icon="clear" /> 
              </div>
              <div class="col-2">
                  <div class="q-pa-md">
                      <q-btn color="white" text-color="orange-9" @click="kullaniciListesiGetir()">
                          <q-icon name="search" font-weight="300" />&nbsp;ARA
                      </q-btn>
                  </div>
              </div>
          </div>



          <!-- TABLO -->
          <q-table title="Kullanıcılar" :rows="kullaniciList" :columns="columns" v-model:pagination="pagination"
              row-key="id" flat bordered>
              <template v-slot:body-cell-action="props">
                  <q-td :props="props">
                      <q-btn icon="brush" title="Düzenle" @click="kullaniciGuncellePopupAc(props.row)" flat></q-btn>
                      <q-btn
                          @click="ayniyatPopupAc(props.row)"
                          title="Ayniyat Gör"
                          icon="visibility"
                          flat
                        >
                        </q-btn>
                    </q-td>
              </template>
          </q-table>
          <div class="q-mt-md">
          </div>
      </div>




<!-- AYNİYAT POP UP -->
      <q-dialog v-model="pop_ayniyat" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-white text-orange-9" style="max-width: 1400px; width: 1400px">
              <q-card-section>
                  <div class="row">
                    <div class="text-h6 col-6">{{ pop_baslik }} </div>  <div class="text-h6 col-6" align="right">{{kullaniciSatirVeri.adSoyad}}</div> 
                  </div>
                  <hr style="background-color: #008080; border-style: none; height: 1px" />
                
              </q-card-section>
              <q-card-section class="q-pt-none">
                  <div class="q-pa-md" style="max-width: 1400px">
                     
                    
    <!-- AYNİYAT-->
      <div class="q-pa-md">

          <div class="row q-ml-sm">

              <div class="col-2">
                  <div class="q-pa-md">
                      <q-btn color="white" text-color="orange-9" @click="ayniyatEklePopupAc()">
                          <q-icon name="playlist_add" font-weight="300" />&nbsp;YENİ
                      </q-btn>
                  </div>
              </div>
              <div class="col-2">
                  <div class="q-pa-md">
                      <q-btn color="white" text-color="lime-9" @click="ayniyatIndir()">
                          <q-icon name="download" font-weight="300" />&nbsp;İNDİR
                      </q-btn>
                  </div>
              </div>

             <div class="col-1 "></div>

             <!-- tarih arama kriteri -->
              <div class="col-3">
                <q-input
                  filled
                  v-model="kriterZimmetTarih"
                  label="Zimmet Tarihi"
                  :rules="['DD.MM.YYYY'||null]"
                  clearable
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          title="Zimmet Tarihi"
                          mask="DD.MM.YYYY"
                          v-model="kriterZimmetTarih"
                          @input="closeDialog"
                          first-day-of-week="1"
                          :locale="{
                            months: ays,
                            monthsShort: ayKisas,
                            days: gunEngs,
                            daysShort: gunKisaEngs,
                          }"
                          today-btn
                          default-view="Years"
                          navigation-min-year-month="2000/01"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Kapat"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-2">
              <q-toggle style="color: grey; text-align: left" class="q-pa-md" v-model="zimmetAraKriter.kaldirilanlariGoster"
              checked-icon="check" color="green" :label="(zimmetAraKriter.kaldirilanlariGoster)?'Kaldırılanları Göster':'Kaldırılanları Gösterme'" unchecked-icon="clear" /> 
              </div>
              
              <div class="col-2">
                  <div class="q-pa-md">
                      <q-btn color="white" text-color="orange-9" @click="ayniyatListesiGetir()">
                          <q-icon name="search" font-weight="300" />&nbsp;ARA
                      </q-btn>
                  </div>
              </div>
          </div>



          <!-- TABLO -->
          <q-table title="Ayniyatlar" :rows="ayniyatList" :columns="ayniyatColumns" v-model:pagination="pagination"
              row-key="id" flat bordered>
              <template v-slot:body-cell-action="props">
                  <q-td :props="props">
                      <q-btn title="Düzenle" @click="ayniyatGuncellePopupAc(props.row)" flat>
                        <q-icon size="2em" name="brush" color="teal" />

                      </q-btn>
                      <q-btn
                          @click="ayniyatGecmisPopupAc(props.row)"
                          title="Geçmiş İşlemleri Gör"
                          flat
                        >
                        <q-icon size="2em" name="history" color="brown 2" />

                        </q-btn>
                        <q-btn
                          @click="ayniyatKaldirPopupAc(props.row)"
                          title="SİL"
                          flat
                        >
                          <q-icon size="2em" name="delete" color="red" />
                        </q-btn>
                    </q-td>
              </template>
          </q-table>
          <div class="q-mt-md">
          </div>
      </div>



                    <div align="right">
                              <q-btn label="KAPAT" type="reset" color="orange-9" flat class="q-ml-sm"
                                  v-close-popup />
                          </div>
                  </div>
              </q-card-section>
          </q-card>
      </q-dialog>

    <!--AYNİYAT EKLE / DEĞİŞTİR POP UP-->
      <q-dialog v-model="pop_ayniyatkayit" persistent transition-show="scale" transition-hide="scale">
          <q-card class="bg-white text-orange-9" style="max-width: 800px; width: 800px">
              <q-card-section>
                  <div class="text-h6">{{ pop_baslik }} </div>
                  <hr style="background-color: #008080; border-style: none; height: 1px" />
              </q-card-section>
              <q-card-section class="q-pt-none">
                  <div class="q-pa-md" style="max-width: 800px">
                      <q-form @submit="ayniyatKaydet()" @reset="ayniyatObjeTemizle()">
                          <!-- kimlik bilgileri -->

                          <div class="row">
                           
                           
                            <q-input filled class="col-4 q-pl-md" v-model="kullaniciSatirVeri.adSoyad"
                                  label="Ad Soyad" lazy-rules
                                  :rules="[true]"
                                 disable />

                                  <q-input filled class="col-4 q-pl-md" v-model="ayniyatObj.stokNo"
                                  label="Stok No" lazy-rules 
                                  :rules="[val =>!val|| val<=100000 || 'En fazla 100000 girilebilir ']" type="number" 

                                  />

                                  <q-input filled class="col-4 q-pl-md" v-model="ayniyatObj.tasinirNo"
                                  label="Taşınır No" lazy-rules
                                  :rules="[true]"
                                  />
                                
                                  <q-input filled class="col-4 q-pl-md" v-model="ayniyatObj.malzemeAd"
                                  label="Malzemenin Adı ve Niteliği" lazy-rules
                                  :rules="[true]"
                                  />

                                  <q-input filled class="col-4 q-pl-md" v-model="ayniyatObj.envanterNo"
                                  label="Envanter No" lazy-rules
                                  :rules="[true]"
                                  />

                                  <q-input filled class="col-4 q-pl-md" v-model="ayniyatObj.birim"
                                  label="Birim" lazy-rules
                                  :rules="[true]"
                                  />

                                  <q-input filled class="col-4 q-pl-md" v-model="ayniyatObj.miktar"
                                  label="Miktar" lazy-rules
                                  :rules="[val =>!val|| val<=100000 || 'En fazla 100000 girilebilir ']" type="number"
                                  />

                                  <q-input filled class="col-4 q-pl-md" v-model="ayniyatObj.seriNo"
                                  label="Seri No" lazy-rules
                                  :rules="[true]"
                                  />

                                  <q-input filled class="col-4 q-pl-md" v-model="ayniyatObj.model"
                                  label="Model" lazy-rules
                                  :rules="[true]"
                                  />

                                  <q-input filled class="col-12 q-pl-md" v-model="ayniyatObj.aciklama"
                                  label="Açıklama" lazy-rules
                                  :rules="[true]"
                                  />
                          </div>

                          <div class="row">
                              <p class="q-ma-md">(*) Zorunlu alanlar</p>
                          </div>
                          <div align="right">
                              <q-btn label="Vazgeç" type="reset" color="orange-9" flat class="q-ml-sm"
                                  v-close-popup />
                              <q-btn label="Kaydet" color="orange-9" type="submit" />
                          </div>
                      </q-form>
                  </div>
              </q-card-section>
          </q-card>
      </q-dialog>


       <!--AYNİYAT SİL POP UP-->
    <q-dialog
      v-model="pop_ayniyatkaldir"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card
        class="bg-white text-orange-9"
        style="max-width: 512px; width: 512px"
      >
        <q-card-section>
          <div class="text-h6">Ayniyat kaldırılsın mı?</div>
          <hr
            style="background-color: #008080; border-style: none; height: 1px"
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="q-pa-md" style="max-width: 512px">
            <q-form @submit="ayniyatKaldir()" @reset="ayniyatObjeTemizle()">
              <div class="row">
                <!-- <q-select filled class="col-3" v-model="obj.kgmBirimId" color="orange-9" label="Teftiş Edilen KGM Birimi *" :options="unvanTips" option-value="id" option-label="ad" emit-value map-options transition-show="jump-up" transition-hide="jump-up" lazy-rules :rules="[ val => val || 'Unvan boş olmamalıdır!']" /> -->
              </div>

              <div align="right">
                <q-btn
                  label="Vazgeç"
                  type="reset"
                  color="orange-9"
                  flat
                  class="q-ml-sm"
                  v-close-popup
                />
                <q-btn label="KALDIR" type="submit" color="orange-9" />
              </div>
            </q-form>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import { date } from "quasar";
import myMixin from 'src/stores/mixin';
import { api } from 'boot/axios';
import { useStore } from 'app/src/stores/store.js';
const store = useStore();


export default {
  mixins: [myMixin],
  data() {
      return {
          pagination: {
              rowsPerPage: 10,
          },
          zimmetAraKriter:{
            kullaniciId:0,
            subeId:0,
            tarih:new Date(),
            kaldirilanlariGoster:false
          },
          kullaniciSatirVeri:{
              id: 0,
              adSoyad:null
            },
          pop_ayniyat:false,
          pop_ayniyatkayit:false,
          pop_ayniyatkaldir:false,

          kullaniciObj: {
              // Sayfada eklemesi güncellemesi yapılan Obje
              id: 0,
              ad:null,
              soyad:null,
              eposta:null,
              unvan:null,
              aktifmi:true,
              subeId:1
          },
          ayniyatObj:{
            id:0,
            stokNo:null,
            tasinirNo:null,
            malzemeAd:null,
            envanterNo:null,
            birim:null,
            miktar:null,
            seriNo:null,
            model:null,
            aciklama:null,
            kullaniciId:null//pop-up açılırken kesinlikle dolmalı
          },
          kriterObj:{
            araText:null,
            subeId:null,
            aktifmi:true
          },
          kullaniciList: [], // Sayfada yönetilen Asıl tipin listesi (Bu Sayfada Ön Talep Listesi)
          ayniyatList:[],
          columns: [
              // Obje Listesinin kolonları
              {
                  label: "İşlem",
                  name: "action",
                  align: "center",
                  style: "width: 100px",
              },
              {
                  name: "ad",
                  align: "left",
                  label: "Ad",
                  field: "ad",
                  sortable: true,
              },
              {
                  name: "soyad",
                  align: "left",
                  label: "Soyad",
                  field: "soyad",
                  sortable: true,
              },
              {
                  name: "eposta",
                  align: "left",
                  label: "E-Posta",
                  field: "eposta",
                  sortable: true,
              },
              {
                  name: "unvan",
                  align: "left",
                  label: "Ünvan",
                  field: "unvan",
                  sortable: false,
              },
              {
                  name: "subeAd",
                  align: "left",
                  label: "Şube Adı",
                  field: "subeAd",
                  sortable: true,
              },
              {
                  name: "aktifmi",
                  align: "left",
                  label: "Aktif mi?",
                  field: "aktifmi",
                  sortable: true,
              },
              {
                  name: "ayniyatSayisi",
                  align: "left",
                  label: "Ayniyat Sayısı",
                  field: "ayniyatSayisi",
                  sortable: false,
              },
          ],
          ayniyatColumns: [
              // Obje Listesinin kolonları
              {
                  label: "İşlem",
                  name: "action",
                  align: "center",
                  style: "width: 100px",
              },
              {
                  name: "stokNo",
                  align: "left",
                  label: "Stok No",
                  field: "stokNo",
                  sortable: false,
              },
              {
                  name: "tasinirNo",
                  align: "left",
                  label: "Tasinir No",
                  field: "tasinirNo",
                  sortable: false,
              },
              {
                  name: "malzemeAd",
                  align: "left",
                  label: "Malzeme Adı",
                  field: "malzemeAd",
                  sortable: true,
              },
              {
                  name: "envanterNo",
                  align: "left",
                  label: "Envanter No",
                  field: "envanterNo",
                  sortable: false,
              },
              {
                  name: "birim",
                  align: "left",
                  label: "Birim",
                  field: "birim",
                  sortable: false,
              },
              {
                  name: "miktar",
                  align: "left",
                  label: "Miktar",
                  field: "miktar",
                  sortable: false,
              },
              {
                  name: "seriNo",
                  align: "left",
                  label: "Seri No",
                  field: "seriNo",
                  sortable: false,
              },
              {
                  name: "model",
                  align: "left",
                  label: "Model",
                  field: "model",
                  sortable: false,
              },
              {
          name: "kayitTarihi",
          align: "left",
          label: "Kayıt Tarihi",
          field: "kayitTarihi",
          format: (val) => date.formatDate(val, "DD.MM.YYYY"),
          sortable: true,
        },
        {
          name: "guncellemeTarihi",
          align: "left",
          label: "Güncelleme Tarihi",
          field: "guncellemeTarihi",
          format: (val) => date.formatDate(val, "DD.MM.YYYY"),
          sortable: true,
        },
        {
          name: "kaldirilmaTarihi",
          align: "left",
          label: "Kaldırılma Tarihi",
          field: "kaldirilmaTarihi",
          format: (val) => date.formatDate(val, "DD.MM.YYYY"),
          sortable: true,
        },
              {
                  name: "aciklama",
                  align: "left",
                  label: "Açıklama",
                  field: "aciklama",
                  sortable: false,
              },
          ],
      }
  },
  methods: {
    ayniyatIndir(){
        api.get("zimmet/excelindir/" + this.kullaniciSatirVeri.id, {
            responseType: "blob",
          })
          .then((resp) => {
            var a = window.document.createElement("a");
            a.href = window.URL.createObjectURL(resp.data);
            a.download = "Ayniyat.xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          });
    },
    ayniyatKaldirPopupAc(satirVeri) {
    
      this.pop_ayniyatkaldir = true;
      this.ayniyatObj.id = satirVeri.id;
      
    },
    ayniyatKaldir() {
      api.get("zimmet/kaldir/" + this.ayniyatObj.id).then((resp) => {
        this.pop_ayniyatkaldir=false;
        this.ayniyatListesiGetir();
        this.$q.notify({
              color: "green-4",
              textColor: "white",
              icon: "check",
              message: "Kaldırma işlemi başarılı",
          });
          });
    },

      kullaniciListesiGetir() {
          var path = "kullanici/listeGetir";
          api.post(path, this.kriterObj)
          .then((resp) => {
            this.kullaniciList=resp.data;
          })
          .catch(function (error) {
            this.$q.notify({
                color: "red-4",
                textColor: "white",
                icon: "error",
                message: "Bir hata oluştu",
            });
          });
      },
      ayniyatListesiGetir() {
          var path = "zimmet/listeGetir";
          api.post(path, this.zimmetAraKriter)
          .then((resp) => {
            this.ayniyatList=resp.data;
          })
          .catch(function (error) {
            this.$q.notify({
                color: "red-4",
                textColor: "white",
                icon: "error",
                message: "Bir hata oluştu",
            });
          });
      },
      ayniyatEklePopupAc(){
        this.pop_ayniyatkayit=true;
        this.pop_baslik="Yeni Ayniyat Kayıt";
        this.ayniyatObjeTemizle();
      },
      ayniyatGuncellePopupAc(satirVerisi){
        api.get("zimmet/getir/" + satirVerisi.id).then((resp) => {
            this.ayniyatObj=resp.data;
              this.pop_ayniyatkayit = true;
              this.pop_baslik = "Kayıt Güncelle";
          });
      },
      kullaniciEklePopupAc() {
          this.pop_kayit = true;
          this.pop_baslik = "Yeni Kullanıcı Kayıt";
          this.kullaniciObjeTemizle();
      },
      kullaniciGuncellePopupAc(satirVerisi) {
          api.get("kullanici/getir/" + satirVerisi.id).then((resp) => {
            this.kullaniciObj=resp.data;
              this.pop_kayit = true;
              this.pop_baslik = "Kayıt Güncelle";
          });
      },
      ayniyatPopupAc(satirVerisi){

        this.zimmetAraKriter.kullaniciId=satirVerisi.id;
        this.kullaniciSatirVeri.id=satirVerisi.id;
        this.kullaniciSatirVeri.adSoyad=satirVerisi.ad+" "+satirVerisi.soyad;
        this.pop_baslik="AYNİYAT GEÇİCİ ALINDISI"

        this.zimmetAraKriter.tarih=new Date()
      //  this.zimmetAraKriter.tarih=new Date((new Date().setHours(0)));
        console.log(this.zimmetAraKriter.tarih)

        this.ayniyatListesiGetir()
        this.pop_ayniyat=true;
      },
      kullaniciKaydet() {
          api.post("kullanici/kaydet", this.kullaniciObj)
              .then((resp) => {
                  if (resp.status == 200) {
                      this.pop_kayit = false;
                      this.kullaniciObjeTemizle();
                      this.kullaniciListesiGetir();
                      this.kayitBasariliMesajiVer();
                  }
                  else {
                      this.kayitBasarisizMesajiVer();
                      this.pop_mesaj = "Bir hata oluştu";
                  }

              })
              .catch(function (error) {
                  this.pop_mesaj = "Kayıt başarısız";
                  this.kayitBasarisizMesajiVer();
              }.bind(this));
      },
      ayniyatKaydet() {
          api.post("zimmet/kaydet", this.ayniyatObj)
              .then((resp) => {
                  if (resp.status == 200) {
                      this.pop_ayniyatkayit = false;
                      this.ayniyatObjeTemizle();
                      this.kayitBasariliMesajiVer();

                      this.zimmetAraKriter.tarih=new Date();//kriter tarihi güncellemezsek son eklenen zimmet gelmez
                      this.ayniyatListesiGetir();
                  }
                  else {
                      this.kayitBasarisizMesajiVer();
                      this.pop_mesaj = "Bir hata oluştu";
                  }

              })
              .catch(function (error) {
                  this.pop_mesaj = "Kayıt başarısız";
                  this.kayitBasarisizMesajiVer();
              }.bind(this));
      },
      kayitBasariliMesajiVer() {
          this.$q.notify({
              color: "green-4",
              textColor: "white",
              icon: "check",
              message: "Kayıt başarılı",
          });

      },
      kayitBasarisizMesajiVer() {
          this.$q.notify({
              color: "red-4",
              textColor: "white",
              icon: "error",
              message: this.pop_mesaj,
          });
      },
      kullaniciObjeTemizle() {

          this.kullaniciObj = {
              // Sayfada eklemesi güncellemesi yapılan Obje
              id: 0,
              ad:null,
              soyad:null,
              eposta:null,
              unvan:null,
              aktifmi:true,
              subeId:1
          }
      },
      ayniyatObjeTemizle(){
this.ayniyatObj={
            id:0,
            stokNo:null,
            tasinirNo:null,
            malzemeAd:null,
            envanterNo:null,
            birim:null,
            miktar:null,
            seriNo:null,
            model:null,
            aciklama:null,
            kullaniciId:null//pop-up açılırken kesinlikle dolmalı
          };
           this.ayniyatObj.kullaniciId= this.kullaniciSatirVeri.id;
      },
      
        
  },
  computed:{
    kriterZimmetTarih:{
      get() {
        return date.formatDate(this.zimmetAraKriter.tarih, "DD.MM.YYYY");
      },
      set(value) {
        if (value == null) {
          this.zimmetAraKriter.tarih = null;
        } else {
            const d = date.extractDate(value, "DD.MM.YYYY");
            this.zimmetAraKriter.tarih = date.formatDate(d, "YYYY-MM-DD");
        }
      },
    },
  },
  mounted() {
      this.fetchSubeler();
      this.kullaniciListesiGetir();
  },
  created() { },
 
};


</script>