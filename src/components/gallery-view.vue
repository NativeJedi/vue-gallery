<template>
  <div class="gallery-view">
    <GalleryLoader v-if="isLoading" />

    <template v-else>
      <div
        class="gallery-view__body">
        <button
          type="button"
          class="btn-default gallery-view__control gallery-view__control--prev"
          @click="$emit('prev')"
        >
          &#10094;
        </button>

        <GalleryImageView :image-url="picture.full_picture" />

        <button
          type="button"
          class="btn-default gallery-view__control gallery-view__control--next"
          @click="$emit('next')"
        >
          &#10095;
        </button>
      </div>

      <footer class="gallery-view__footer">
        <div class="gallery-view__row">
          <span class="gallery-view__label">Author:</span>
          <span class="gallery-view__value">{{ picture.author }}</span>
        </div>
        <div class="gallery-view__row">
          <span class="gallery-view__label">Camera:</span>
          <span class="gallery-view__value">{{ picture.camera }}</span>
        </div>
        <div class="gallery-view__row">
          <span class="gallery-view__label">Hash tags:</span>
          <span class="gallery-view__value">{{ picture.tags }}</span>
        </div>
        <div class="gallery-view__row">
          <button type="button" @click="sharePhoto">Share</button>

          <input
            ref="inputUrl"
            class="gallery-view__url-input"
            :value="picture.full_picture"
            readonly
          >
        </div>
      </footer>
    </template>
  </div>
</template>

<script>
import { getImageDetails } from '@/api/requests';
import GalleryImageView from '@/components/gallery-image-view.vue';
import GalleryLoader from '@/components/gallery-loader.vue';

export default {

  name: 'GalleryView',

  components: { GalleryImageView, GalleryLoader },

  props: {
    pictureId: {
      type: String,
      default: null,
    },

    nextPictureId: {
      type: String,
      default: null,
    },

    prevPictureId: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      isLoading: false,
      picture: null,
      picturesStorage: new Map(),
    };
  },

  watch: {
    pictureId: {
      immediate: true,
      async handler(pictureId) {
        if (!pictureId) {
          return;
        }

        const storedPicture = this.picturesStorage.get(pictureId);

        if (storedPicture) {
          this.picture = storedPicture;
          return;
        }

        this.isLoading = true;
        this.picture = await this.getImage(pictureId);
        this.isLoading = false;
      },
    },

    nextPictureId: {
      immediate: true,
      handler(pictureId) {
        this.loadAdjacentPicture(pictureId);
      },
    },

    prevPictureId: {
      immediate: true,
      handler(pictureId) {
        this.loadAdjacentPicture(pictureId);
      },
    },
  },

  methods: {
    loadAdjacentPicture(pictureId) {
      if (!pictureId || this.picturesStorage.has(pictureId)) {
        return;
      }

      this.getImage(pictureId);
    },

    async getImage(pictureId = this.pictureId) {
      const picture = await getImageDetails(pictureId);
      this.picturesStorage.set(picture.id, picture);
      return picture;
    },

    sharePhoto() {
      this.$refs.inputUrl.select();

      document.execCommand('copy');
    },
  },

};
</script>

<style lang="scss" scoped>
.gallery-view {
  position: relative;
  width: 800px;
  background-color: #fff;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: 767px) {
    width: 100%;
    max-height: unset;
    height: 100%;
  }

  &__body {
    position: relative;
    width: 100%;
  }

  &__footer {
    padding: 15px 15px 0 15px;
    @media only screen and (max-width: 767px) {
      padding: 15px 0 0 0;
    }
  }

  &__row {
    display: flex;
    font-size: 14px;
    &:not(:last-child) {
      margin-bottom: 5px;
    }
  }

  &__label {
    display: inline-block;
    font-weight: 500;
    margin-right: 5px;
    flex-shrink: 0;
  }

  &__control {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 30px;

    &--prev {
      left: -20px;
    }

    &--next {
      right: -20px;
    }
  }

  &__url-input {
    width: 100%;
    max-width: 500px;
    margin-left: 20px;
  }
}
</style>
