<template>
 <div class="page">
        <div class="md-modal modal-msg md-modal-transition " v-bind:class="{'md-show':mdShow}">
          <div class="md-modal-inner">
            <div class="md-top">
               <button class="md-close" @click="closeModal">Close</button>
            </div>
            <div class="md-content">
              <div class="confirm-tips">
                 <slot name="message"></slot>
              </div>
              <div class="btn-wrap" >
                 <slot name="btnGroup"  @click="closeModal"></slot>
              </div>
            </div>
          </div>
        </div>
        <div class="md-overlay" v-if="mdShow" @click="closeModal"></div>
 </div>
</template>

<script>
 import './../assets/css/login.css'                         
 export default {
   props: ["mdShow"],
   components: {

   },
   methods: {
       closeModal () {
           console.log(1)
           this.$emit("close");
       }
   }
 }
</script>

<style >

 
</style>
