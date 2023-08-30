<script setup lang="ts">
  defineProps({
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
        :height="height"
        :src="image"
        :width="width"
      />
    </NuxtLink>
  </div>

  <div class="disclaimer mx-auto">
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
  width: calc(v-bind(width) * 1px);
}
</style>