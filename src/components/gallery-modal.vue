<template>
  <div
    v-if="isVisible"
    class="gallery-modal">
    <div class="gallery-modal__window">
      <button
        type="button"
        class="gallery-modal__close btn-default"
        @click="$emit('change', false)"
      >
        &#10005;
      </button>

      <slot/>
    </div>
  </div>
</template>

<script>
export default {

  name: 'GalleryModal',

  model: {
    prop: 'isVisible',
    event: 'change',
  },

  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    isVisible: {
      immediate: true,
      handler() {
        document.body.style.overflowY = this.isVisible ? 'hidden' : null;
      },
    },
  },

};
</script>

<style lang="scss" scoped>
.gallery-modal {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(#000, 0.5);

  &__window {
    padding: 30px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    @media only screen and (max-width: 767px) {
      width: 100%;
      height: 100%;
    }
  }

  &__close {
    position: absolute;
    right: 7px;
    top: 4px;
    font-size: 24px;
  }
}
</style>
