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
  const PADDING_AD = 5;
  interface StateObject {
    disclaimerText: string;
    widthWindow: number | undefined;
  }
  const DEFAULT_DISCLAIMER_TEXT = 'Ad • Amazon';
  const state: StateObject = reactive({
    disclaimerText: DEFAULT_DISCLAIMER_TEXT,
    widthWindow: undefined,
  });


  // === Computed Fields ===
  /**
   * Adjust image dimension to fit into parent window
   */
  const imgDimension = computed(() => {
    const widthRequiredForImage = (props.width + PADDING_AD * 2);
    if (state.widthWindow && state.widthWindow < widthRequiredForImage) {
      const newWidthImage = state.widthWindow - (PADDING_AD * 2);
      return {
        height: props.height * (newWidthImage / props.width),
        width: newWidthImage,
      }
    }

    return {
      height: props.height,
      width: props.width,
    }
  });


  // === Methods ===
  const swapDisclaimerText = () => {
    state.disclaimerText = state.disclaimerText === DEFAULT_DISCLAIMER_TEXT ?
      'Disclaimer: As an Amazon Associate I earn from qualifying purchases' :
      DEFAULT_DISCLAIMER_TEXT;
  };


  // === Life Cycle Hooks ===
  onMounted(() => {
    /**
     * Record new window width to support resize of banner to fit inside parent window
     */
    const recordWindowWidth = (event: Event) => {
      state.widthWindow = (event.target as Window)?.innerWidth;
      // console.log(`[${utility.currentFileName}::recordWindowWidth] state.widthWindow:`, state.widthWindow);
    };

    window.onload = recordWindowWidth;
    window.onresize = recordWindowWidth;
  });
</script>

<template>
  <div class="ad-wrapper">
    <div class="disclaimer" @click="swapDisclaimerText">
      {{ state.disclaimerText }}
    </div>

    <NuxtLink
      rel="nofollow noopener"
      target="_blank"
      :href="href"
    >
      <img
        :alt="imageAltText"
        :height="imgDimension.height"
        :src="image"
        :width="imgDimension.width"
      />
    </NuxtLink>
  </div>
</template>

<style scoped>
.ad-wrapper {
  background-color: white;
  border-radius: calc(v-bind(PADDING_AD) * 1px);
  margin-left: auto;
  margin-right: auto;
  width: calc(v-bind(imgDimension.width) * 1px + v-bind(PADDING_AD) * 2px);
}

.disclaimer {
  background: linear-gradient(to bottom left, black, #999);
  border-radius: calc(v-bind(PADDING_AD) * 1px) calc(v-bind(PADDING_AD) * 1px) 0px 0px;
  color: white;
  cursor: pointer;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 0.75rem;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1px;
  margin-bottom: 5px;
  padding: calc(v-bind(PADDING_AD) * 1px);
  width: calc(v-bind(imgDimension.width) * 1px);
}
</style>