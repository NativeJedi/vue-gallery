<template>
  <div class="gallery-image-view">
    <v-zoomer>
      <img
        :src="imageUrl"
        alt="Gallery photo"
      >
    </v-zoomer>
  </div>
</template>

<script>
export default {

  name: 'GalleryImageView',

  props: {
    imageUrl: {
      type: String,
      required: true,
    },
  },

};
</script>

<style lang="scss" scoped>
  .gallery-image-view {
    text-align: center;
    height: 500px;
    @media only screen and (max-width: 767px) {
      height: auto;
    }
    img {
      max-width: 100%;
      max-height: 500px;
    }
  }
</style>
