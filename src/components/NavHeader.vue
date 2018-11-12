<template>
  <div id='nav-header'>
    <div id='title'>{{title}}</div>
    <div id='nav'>
      <a id='guo' href='#'>
        <img :src='guo'>
      </a>
      <a id='wang' href='https://hanwgeek.github.io/'>
        <img :src='wang'>
      </a>
      <a id='liu' href='#'>
        <img :src='liu'>
      </a>
      <a id='liang' href='#'>
        <img :src='liang'>
      </a>
      <a id='yang' href='#'>
        <img :src='yang'>
      </a>
    </div>
  </div>
</template>


<script>
export default {
  data () {
    return {
      title: 'Railway Star',
      wang: require("../assets/wang.jpg"),
      guo: require("../assets/guo.jpg"),
      liu: require("../assets/liu.jpg"),
      liang: require("../assets/liang.jpg"),
      yang: require("../assets/yang.jpg")
    }
  }
}
</script>

<style scoped>
#nav-header {
  position: fixed;
  height: 40px;
  width: 100%;
  padding: 10px 50px;
  line-height: 40px;
  top: 0;
  left: 0;
  z-index: 100;
  background-color: #fff;
  box-shadow: 0 0 1px rgba(0,0,0,0.25);
}

#title {
  font-size: 24px;
  float: left;
  vertical-align: center;
}

#guo img{
  position: fixed;
  right: 195px;
  height: 40px;
  border-radius: 50%;
}

#liu img{
  position: fixed;
  right: 150px;
  height: 40px;
  border-radius: 50%;
}

#liang img{
  position: fixed;
  right: 105px;
  height: 40px;
  border-radius: 50%;
}

#yang img{
  position: fixed;
  right: 60px;
  height: 40px;
  border-radius: 50%;
}

#wang img{
  position: fixed;
  right: 15px;
  height: 40px;
  border-radius: 50%;
}


</style>


