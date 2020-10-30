<template>
  <div class="gallery-loader">
    <PacmanLoader />
  </div>
</template>

<script>
import PacmanLoader from 'vue-spinner/src/PacmanLoader.vue';

export default {

  name: 'GalleryLoader',

  components: {
    PacmanLoader,
  },

};
</script>

<style lang="scss" scoped>
  .gallery-loader {
    display: flex;
    justify-content: center;
    padding: 20px;
  }
</style>
