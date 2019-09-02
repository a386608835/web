<template>
  <div id="app">
    <img @click="handleClick" src="./assets/logo.png">
    <router-view/>
    <index></index>
  </div>
</template>

<script>
  import Index from "components/index"
export default {
  data(){
    return {

    }
  },
  methods:{
    handleClick(){
      console.log("niuq")
    }
  },
  components:{
    Index

  }
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
