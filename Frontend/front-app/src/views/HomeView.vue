<template>
  <div class="home">
    <h1>Welcome to the Chocolate Factory</h1>
    <img alt="Chocolate Factory" src="@/assets/logo.png" class="factory-logo" />
    <p class="chocolate-info">
      Welcome to the world of chocolate! Here at our Chocolate Factory, we craft the finest chocolates using traditional methods combined with modern technology. Our factory is known for its dedication to quality and innovation, creating delightful treats for chocolate lovers around the globe.

      Every piece of chocolate that comes out of our factory is made with the utmost care and precision. From sourcing the highest quality cocoa beans to the final packaging, we ensure that every step of the process meets our high standards.

      Visit us to explore our wide range of chocolate products, from classic dark chocolate bars to creative new flavors. Our factory tours offer a behind-the-scenes look at how we create our delectable chocolates, with plenty of samples to enjoy along the way.

      Join us in celebrating the joy of chocolate, and experience the passion and craftsmanship that goes into every bite. Whether you're a lifelong chocolate aficionado or a curious newcomer, we have something special for everyone.
    </p>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.home {
  padding: 20px;
  text-align: center;
  background-color: #D2B48C; /* Svetlija braon boja */
}

h1 {
  font-family: 'Arial', sans-serif;
  color: #4b3832; /* Tamno braon boja */
  font-size: 2.5em; /* Veći font */
  font-style: italic; /* Italic stil */
  font-weight: bold; /* Boldovan tekst */
}

.factory-logo {
  margin-top: 20px;
  max-width: 80%; /* Maksimalna širina slike */
  height: auto;
}

.chocolate-info {
  margin-top: 20px;
  font-family: 'Arial', sans-serif;
  color: #6B4226; /* Braon boja */
  font-size: 1.2em; /* Povećan font */
  text-align: left; /* Tekst poravnan sa leve strane */
}
</style>
