<script setup lang="ts">
  // === Composables ===
  const utility = useUtility(import.meta);


  // === Props ===
  const props = defineProps({
    height: {
      type: Number,
      default: 250,
    },
    // e.g. https://amzn.to/3rplmNE
    href: {
      type: String,
      required: true,
    },
    // Note: Images should be in the folder `public/images/Amazon/`
    // Example image value: /images/Amazon/1028240_student_v5_associate_300x250.jpg
    image: {
      type: String,
      required: true,
    },
    imageAltText: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 300,
    },
  });


  // === Data ===
  const state = reactive({
    height: props.height,
    width: props.width,
  })

  // === Life Cycle Hooks ===
  onMounted(() => {
    /**
     * Resize banner to fit inside parent window
     */
    const resizeImageBasedOnWindowWidth = (event: Event) => {
      const widthWindow = (event.target as Window)?.innerWidth;
      // console.log(`[${utility.currentFileName}::resizeImageBasedOnWindowWidth] widthWindow:`, widthWindow);

      if (widthWindow && widthWindow < props.width) {
        // console.log(`[${utility.currentFileName}::resizeImageBasedOnWindowWidth] widthWindow, props.width:`, widthWindow, props.width);
        state.width = widthWindow;
        state.height = props.height * (state.width / props.width);
        return;
      }

      state.height = props.height;
      state.width = props.width;
    };

    window.onload = resizeImageBasedOnWindowWidth;
    window.onresize = resizeImageBasedOnWindowWidth;
  });
</script>

<template>
  <div class="image-link">
    <NuxtLink
      rel="nofollow noopener"
      target="_blank"
      :href="href"
    >
      <img
        :alt="imageAltText"
        :height="state.height"
        :src="image"
        :width="state.width"
      />
    </NuxtLink>
  </div>

  <div class="disclaimer">
    Disclaimer: As an Amazon Associate I earn from qualifying purchases
  </div>
</template>

<style scoped>
.image-link {
  /* 0 line-height removes gap between image and disclaimer */
  line-height: 0px;
}

.disclaimer {
  background-color: white;
  color: black;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 9px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1px;
  width: calc(v-bind(state.width) * 1px);
}
</style>