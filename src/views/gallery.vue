<template>
  <div class="gallery">
    <h1 class="gallery__title">Gallery</h1>

    <div class="gallery__grid">
      <GalleryItem
        v-for="picture in pictures"
        :key="picture.id"
        :picture="picture"
        @click="handleClick"
      />
    </div>

    <GalleryLoader
      v-if="hasMore"
      ref="loader"
    />

    <GalleryModal
      v-model="isModalVisible"
    >
      <GalleryView
        :picture-id="shownPictureId"
        :next-picture-id="nextPictureId"
        :prev-picture-id="prevPictureId"
        @next="switchNextImage"
        @prev="switchPrevImage"
      />
    </GalleryModal>
  </div>
</template>

<script>
import { getImages } from '@/api/requests';
import GalleryItem from '@/components/gallery-item.vue';
import GalleryLoader from '@/components/gallery-loader.vue';
import GalleryModal from '@/components/gallery-modal.vue';
import GalleryView from '@/components/gallery-view.vue';

const setObserver = (callback) => new IntersectionObserver(
  callback,
  {
    root: null,
    rootMargin: '300px',
    threshold: 0,
  },
);

export default {

  name: 'Gallery',

  components: {
    GalleryView,
    GalleryModal,
    GalleryLoader,
    GalleryItem,
  },

  data() {
    return {
      pictures: [],
      page: 0,
      observer: null,
      coordsFromTop: 0,
      hasMore: true,
      shownPictureId: null,
      isModalVisible: false,
      loadPromise: Promise.resolve(),
    };
  },

  computed: {
    currentPictureIndex() {
      const currentIndex = this.pictures.findIndex(({ id }) => id === this.shownPictureId);

      return currentIndex >= 0 && currentIndex;
    },

    nextPicture() {
      return this.pictures[this.currentPictureIndex + 1];
    },

    prevPicture() {
      return this.pictures[this.currentPictureIndex - 1];
    },

    prevPictureId() {
      const { id } = this.prevPicture || {};

      return id;
    },

    nextPictureId() {
      const { id } = this.nextPicture || {};

      return id;
    },
  },

  watch: {
    nextPictureId: {
      immediate: true,
      handler() {
        if (this.nextPictureId && this.hasMore) {
          this.loadImages();
        }
      },
    },
  },

  async mounted() {
    this.observer = setObserver(this.handleObserve);
    this.observer.observe(this.$refs.loader.$el);
  },

  destroyed() {
    this.observer.disconnect();
  },

  methods: {
    handleClick(shownPictureId) {
      this.shownPictureId = shownPictureId;
      this.isModalVisible = true;
    },

    handleObserve(entries) {
      const [loaderElem] = entries;
      const { y } = loaderElem.boundingClientRect;
      const currentElementCoords = window.pageYOffset + y;

      const isScrolledDown = currentElementCoords > this.coordsFromTop;

      if (loaderElem.isIntersecting && isScrolledDown) {
        this.coordsFromTop = currentElementCoords;
        this.loadImages();
      }
    },

    async loadImages() {
      await this.loadPromise; // Wait for previous request...

      this.page += 1;
      this.loadPromise = getImages(this.page);

      const { pictures, hasMore } = await this.loadPromise;

      this.pictures = [...this.pictures, ...pictures];
      this.hasMore = hasMore;
    },

    switchPrevImage() {
      const prevImage = this.pictures[this.currentPictureIndex - 1];

      if (!prevImage) {
        return;
      }

      this.shownPictureId = prevImage.id;
    },

    async switchNextImage() {
      if (!this.nextPictureId) {
        return;
      }

      this.shownPictureId = this.nextPictureId;
    },
  },
};
</script>

<style lang="scss" scoped>
.gallery__title {
  text-align: center;
}
.gallery__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, 300px);
  grid-gap: 10px;
  justify-content: center;
}
</style>
