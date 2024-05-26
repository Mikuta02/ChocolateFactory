<template>
  <div class="home">
    <h1>Welcome to the Chocolate Factory</h1>
    <img alt="Chocolate Factory" src="@/assets/logo.png" class="factory-image">
    <p class="chocolate-info">
      Chocolate is a beloved treat enjoyed by people of all ages around the world. It is made from cocoa beans, which are harvested from the cacao tree. The process of making chocolate involves fermenting, drying, roasting, and grinding the cocoa beans to produce cocoa mass, cocoa butter, and cocoa powder. These ingredients are then combined in various proportions to create different types of chocolate, such as dark chocolate, milk chocolate, and white chocolate.

      Chocolate is not only delicious but also has a rich history. It was first cultivated by the ancient civilizations of Mesoamerica, including the Aztecs and Mayans, who used cocoa beans as currency and made a bitter drink called "xocoatl". When chocolate was introduced to Europe in the 16th century, it quickly became a popular delicacy and was transformed into the sweet treat we know today.

      Besides its delightful taste, chocolate also contains several beneficial compounds, such as antioxidants, which can contribute to improved health when consumed in moderation. Whether enjoyed as a simple bar, in desserts, or as a warm beverage, chocolate continues to be a cherished indulgence around the globe.
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
  background-color: #D2B48C; /* svetlija braon boja */
}

h1 {
  font-family: 'Arial', sans-serif;
  color: #4b3832; /* tamno braon boja */
  font-size: 2.5em; /* veći font */
  font-weight: bold; /* boldovan tekst */
  font-style: italic; /* italic stil */
}

.factory-image {
  margin-top: 20px;
  max-width: 80%; /* smanjena širina slike */
  height: auto;
  width: 30%;
}

.chocolate-info {
  margin-top: 20px;
  font-family: 'Arial', sans-serif;
  color: #6B4226; 
  font-size: 1.2em; 
  text-align: left; 

}
</style>
