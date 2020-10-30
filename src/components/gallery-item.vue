<template>
  <button
    class="btn-default gallery-item"
    @click="$emit('click', picture.id)"
  >
    <img :src="picture.cropped_picture" alt="Photo">
  </button>
</template>

<script>
export default {

  name: 'GalleryItem',

  props: {
    picture: {
      type: Object,
      required: true,
    },
  },

};
</script>
