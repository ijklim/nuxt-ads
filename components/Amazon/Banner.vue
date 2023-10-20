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
    imageDescription: {
      type: String,
      default: undefined,
    },
    price: {
      type: Number,
      default: undefined,
    },
    priceDiscountAmount: {
      type: String,
      default: undefined,
    },
    width: {
      type: Number,
      default: 300,
    },
  });


  // === Data ===
  const PADDING_AD = 5;
  const DISCLAIMER_TITLE_COLOR_1 = '#1E1D1B';
  const DISCLAIMER_TITLE_COLOR_2 = '#CC9934';
  interface IStateObject {
    disclaimerText: string;
    widthWindow: number | undefined;
  }
  const DEFAULT_DISCLAIMER_TEXT = 'Ad • Amazon';
  const state: IStateObject = reactive({
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
      <figure>
        <img
          :alt="imageAltText"
          :height="imgDimension.height"
          :src="image"
          :width="imgDimension.width"
        />

        <hr>

        <figcaption>
          {{ imageDescription ?? imageAltText }}
          <div v-if="price">
            <span
              style="color:red;"
              v-if="priceDiscountAmount"
              v-text="priceDiscountAmount">
            </span>
            ${{ price.toFixed(2) }}
          </div>
        </figcaption>
      </figure>
    </NuxtLink>
  </div>

  <!-- Note: div needed for iframe resizer to reserve vertical space for bottom border of `img-wrapper` -->
  <div style="line-height: 2px;">&nbsp;</div>
</template>

<style scoped>
.ad-wrapper {
  margin-left: auto;
  margin-right: auto;
  width: calc(v-bind(imgDimension.width) * 1px + v-bind(PADDING_AD) * 2px);
}

a {
  /* Remove underline in figcaption */
  text-decoration: none;
}

/* === Wrapper around product image, add border and padding === */
figure {
  background-color: white;
  border: 1px solid v-bind(DISCLAIMER_TITLE_COLOR_2);
  border-top: none;
  padding: calc(v-bind(PADDING_AD) * 1px);
  padding-bottom: 0px;
  margin: 0px;
}

/* === Separator before caption === */
figure hr {
  border-style: dashed;
  margin: 7px auto 3px;
  width: 33%;
}

/* === Caption for product image === */
figure figcaption {
  color: v-bind(DISCLAIMER_TITLE_COLOR_1);
  cursor: pointer;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-size: 0.9rem;
  padding: 5px 0px;
  width: 100%;
}

/* Gradient Samples: https://www.eggradients.com/category/brown-gradient */
.disclaimer {
  background: linear-gradient(to bottom left, v-bind(DISCLAIMER_TITLE_COLOR_1), v-bind(DISCLAIMER_TITLE_COLOR_2));
  border-radius: calc(v-bind(PADDING_AD) * 1px) calc(v-bind(PADDING_AD) * 1px) 0px 0px;
  color: white;
  cursor: pointer;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 0.75rem;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1px;
  padding: calc(v-bind(PADDING_AD) * 1px);
  width: calc(v-bind(imgDimension.width) * 1px);
}
</style>