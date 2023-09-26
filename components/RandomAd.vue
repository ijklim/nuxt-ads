<!-- === Randomly pick one ad from available Google or Amazon ads === -->
<!-- Supports route query `adtype` to include (e.g. MochahostBanner) or exclude (e.g. -GoogleAdSense) an AdType from being picked -->
<script setup lang="ts">
  import { Script } from '@unhead/vue';


  // === Composables ===
  const { query } = useRoute();
  const utility = useUtility(import.meta);
  // console.log(`[${utility.currentFileName}] query:`, query);

  // === Data ===
  /**
   * Ad Types that could be displayed
   */
  type AdType = 'none' | 'AmazonBanner' | 'GoogleAdSense' | 'MochahostBanner';

  interface AmazonAdObject {
    adType: AdType;
    displayRatio: number;
    height?: number;
    href: string;
    imageAltText: string;
    imagePath: string;
    width?: number;
  };

  // For initialization only
  interface EmptyAdObject {
    adType: AdType;
    displayRatio: number;
  }

  interface GoogleAdObject {
    adFormat: string;
    adLayoutKey: string;
    adSlot: number;
    adType: AdType;
    displayRatio: number;
  };

  interface MochahostAdObject {
    adType: AdType;
    displayRatio: number;
    href: string;
    imageAltText: string;
    imageUrl: string;
  };

  type AdObject = AmazonAdObject | EmptyAdObject | GoogleAdObject | MochahostAdObject;

  interface AdsObject {
    [key: string]: AdObject;
  };

  const ads: AdsObject = {
    // === Amazon Product ===
    amazonProductCoolerArcticZoneTitan: {
      adType: 'AmazonBanner',
      height: 304,
      href: 'https://www.amazon.com/Arctic-Zone-Freeze-Zipperless-HardBody/dp/B09YFGYYNF?pd_rd_w=DpYWL&content-id=amzn1.sym.309d45c5-3eba-4f62-9bb2-0acdcf0662e7&pf_rd_p=309d45c5-3eba-4f62-9bb2-0acdcf0662e7&pf_rd_r=P0SK8QPRF1Z85YZS7ZNC&pd_rd_wg=muqFO&pd_rd_r=ce76e212-0fdb-4675-8b08-3afc4ec996f4&pd_rd_i=B0CJJK9H3Q&th=1&linkCode=ll1&tag=aimprove-20&linkId=092234b09600657380c789b3d42a792c&language=en_US&ref_=as_li_ss_tl',
      imagePath: 'Amazon/CoolerArcticZoneTitan.webp',
      imageAltText: `Arctic Zone Titan Deep Freeze Zipperless Hardbody Cooler`,
      width: 300,
      displayRatio: 5,
    },
    amazonProductMiniPcNab6: {
      adType: 'AmazonBanner',
      height: 145,
      href: 'https://www.amazon.com/NAB6-i7-12650H-Threads-PCIe4-0-Computer/dp/B0C1X191NR?pd_rd_w=OLaNN&content-id=amzn1.sym.81e01203-65b8-4d65-b4bf-32a39dde4f92&pf_rd_p=81e01203-65b8-4d65-b4bf-32a39dde4f92&pf_rd_r=PBWGGNX4812AM560CCWJ&pd_rd_wg=N8JiI&pd_rd_r=348798bf-bf95-4fb5-86d4-c8d438d3645c&pd_rd_i=B0C1X191NR&psc=1&linkCode=ll1&tag=aimprove-20&linkId=dfd65a3cde9039a955f0ac6cc8e71f0f&language=en_US&ref_=as_li_ss_tl',
      imagePath: 'Amazon/MiniPcNab6.webp',
      imageAltText: `Mini PC NAB6 Intel Core i7-12650H`,
      width: 300,
      displayRatio: 5,
    },
    amazonProductPickleballPaddlesMTEN: {
      adType: 'AmazonBanner',
      height: 301,
      href: 'https://www.amazon.com/Pickleball-Paddles-Approved-Fiberglass-Portable/dp/B0BYV7P9X7?pd_rd_w=DpYWL&content-id=amzn1.sym.309d45c5-3eba-4f62-9bb2-0acdcf0662e7&pf_rd_p=309d45c5-3eba-4f62-9bb2-0acdcf0662e7&pf_rd_r=P0SK8QPRF1Z85YZS7ZNC&pd_rd_wg=muqFO&pd_rd_r=ce76e212-0fdb-4675-8b08-3afc4ec996f4&pd_rd_i=B0CJK2QWK2&psc=1&linkCode=ll1&tag=aimprove-20&linkId=270e7705d6ad777987bbcbea655ac255&language=en_US&ref_=as_li_ss_tl',
      imagePath: 'Amazon/PickleballPaddlesMTEN.webp',
      imageAltText: `MTEN Pickleball Paddles, USAPA Approved Fiberglass Surface Pickleball Set`,
      width: 300,
      displayRatio: 5,
    },
    amazonProductSmartWatchAppleUltra2: {
      adType: 'AmazonBanner',
      height: 335,
      href: 'https://www.amazon.com/Apple-Cellular-Smartwatch-Precision-Extra-Long/dp/B0CHWZ5VVM?pd_rd_w=F1SKE&content-id=amzn1.sym.309d45c5-3eba-4f62-9bb2-0acdcf0662e7&pf_rd_p=309d45c5-3eba-4f62-9bb2-0acdcf0662e7&pf_rd_r=P0SK8QPRF1Z85YZS7ZNC&pd_rd_wg=muqFO&pd_rd_r=ce76e212-0fdb-4675-8b08-3afc4ec996f4&pd_rd_i=B0CHWZ5VVM&psc=1&linkCode=ll1&tag=aimprove-20&linkId=0cfba7bb290c3f2bbd5222c95a212fca&language=en_US&ref_=as_li_ss_tl',
      imagePath: 'Amazon/SmartWatchAppleUltra2.webp',
      imageAltText: `Apple Smart Watch Ultra 2 `,
      width: 300,
      displayRatio: 5,
    },
    amazonProductSmartWatchTozoS3: {
      adType: 'AmazonBanner',
      height: 304,
      href: 'https://www.amazon.com/TOZO-S3-Bluetooth-Waterproof-Compatible/dp/B07L1GWR66?pd_rd_w=F1SKE&content-id=amzn1.sym.309d45c5-3eba-4f62-9bb2-0acdcf0662e7&pf_rd_p=309d45c5-3eba-4f62-9bb2-0acdcf0662e7&pf_rd_r=P0SK8QPRF1Z85YZS7ZNC&pd_rd_wg=muqFO&pd_rd_r=ce76e212-0fdb-4675-8b08-3afc4ec996f4&pd_rd_i=B0CGLL1JHG&th=1&linkCode=ll1&tag=aimprove-20&linkId=1e1f5d8a5d12a12ef95f24c6e61dcf84&language=en_US&ref_=as_li_ss_tl',
      imagePath: 'Amazon/SmartWatchTozoS3.webp',
      imageAltText: `TOZO S3 Smart Watch`,
      width: 300,
      displayRatio: 5,
    },
    amazonProductTvAmazonFire55: {
      adType: 'AmazonBanner',
      height: 194,
      href: 'https://www.amazon.com/amazon-fire-tv-55-inch-4-series-4k-smart-tv/dp/B0B3H6JPYZ?pd_rd_w=F1SKE&content-id=amzn1.sym.309d45c5-3eba-4f62-9bb2-0acdcf0662e7&pf_rd_p=309d45c5-3eba-4f62-9bb2-0acdcf0662e7&pf_rd_r=P0SK8QPRF1Z85YZS7ZNC&pd_rd_wg=muqFO&pd_rd_r=ce76e212-0fdb-4675-8b08-3afc4ec996f4&pd_rd_i=B0B3H6JPYZ&psc=1&linkCode=ll1&tag=aimprove-20&linkId=9306e2f9c9140bbb99081aa47db5be9a&language=en_US&ref_=as_li_ss_tl',
      imagePath: 'Amazon/TvAmazonFire55.webp',
      imageAltText: `TOZO S3 Smart Watch`,
      width: 300,
      displayRatio: 5,
    },


    // === Google AdSense ===
    googleInFeed: {
      adFormat: 'fluid',
      adLayoutKey: '-fb+5w+4e-db+86',
      adSlot: 7471404401,
      adType: 'GoogleAdSense',
      displayRatio: 5,
    },


    // === Mochahost Web Hosting ===
    mochahostAd: {
      adType: 'MochahostBanner',
      href: 'https://affiliates.mochahost.com/idevaffiliate.php?id=6756&tid1=ivan-lim.com',
      imageAltText: 'MochaHost Web Hosting',
      displayRatio: 2,
    },
  };
  const state = reactive({
    whichAdToShow: { adType: 'none', displayRatio: 0 },
  });


  // === Methods ===
  const getImageUrl = (imagePath: string) => {
    // Note: Path must start with a static folder (e.g. ./images/) for Vite to process the image in Production build
    // https://vitejs.dev/guide/assets.html
    const result = new URL(`../assets/img/${imagePath}`, import.meta.url).href;
    return result;
  };

  /**
   * Randomly pick an ad from `ads` considering displayRatio
   */
  const pickRandomAd = () => {
    const adKeys = Object.keys(ads)
      .filter((adKey) => {
        // Filter by url query `adtype` if exists
        const filterAdType = query?.adtype;

        if (!filterAdType) {
          return true;
        }

        if ((filterAdType as string).startsWith('-')) {
          // If adtype starts with '-', filter out the key that matches the string that comes after
          return ads[adKey].adType.toLowerCase() !== (filterAdType.slice(1) as string).toLowerCase();
        }

        // True if adType matches query 'adtype'
        return ads[adKey].adType.toLowerCase() === (filterAdType as string).toLowerCase();
      });

    // availableAds e.g. ['googleInFeed', 'googleInFeed', 'amazonPrimeStudent', ...]
    const availableAds = adKeys.flatMap(adKey => Array(ads[adKey].displayRatio).fill(adKey));
    // console.log(`[${utility.currentFileName}::pickRandomAd] availableAds:`, availableAds);

    if (!availableAds.length) {
      // No available ad, most likely filter has removed all available ads
      return Object.values(ads)[0];
    }

    const indexRandom = Math.floor(Math.random() * availableAds.length);
    // console.log(`[${utility.currentFileName}::pickRandomAd] indexRandom:`, indexRandom);

    // adKeySelected e.g. googleInFeed
    const adKeySelected = availableAds[indexRandom];

    return ads[adKeySelected];
  };


  // === Lifecycle Hooks ===
  onMounted(() => {
    state.whichAdToShow = pickRandomAd();

    const scripts: Script[] = [
      // Supports iframe resizing on parent window
      {
        async: true,
        crossorigin: 'anonymous',
        integrity: 'sha512-R7Piufj0/o6jG9ZKrAvS2dblFr2kkuG4XVQwStX+/4P+KwOLUXn2DXy0l1AJDxxqGhkM/FJllZHG2PKOAheYzg==',
        referrerpolicy: 'no-referrer',
        src: 'https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.6/iframeResizer.contentWindow.min.js',
        type: 'text/javascript',
      },
    ];

    // Add Google AdSense script only if necessary
    if (state.whichAdToShow.adType === 'GoogleAdSense') {
      // Important: `.env::VITE_AD_CLIENT` must be set in the importing project, the one in the current project will be ignored
      const srcScriptGoogleAdSense = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${import.meta.env.VITE_AD_CLIENT}`;
      scripts.push({
        async: true,
        crossorigin: 'anonymous',
        src: srcScriptGoogleAdSense,
      });
    }

    useHead({
      script: scripts,
    });
  });
</script>

<template>
  <div id="nuxt-ad" class="text-center">
    <!-- === Google AdSense === -->
    <GoogleAdSense
      v-if="state.whichAdToShow.adType === 'GoogleAdSense'"
      :adFormat="(<GoogleAdObject>state.whichAdToShow).adFormat"
      :adLayoutKey="(<GoogleAdObject>state.whichAdToShow).adLayoutKey"
      :adSlot="(<GoogleAdObject>state.whichAdToShow).adSlot"
    />

    <!-- === Amazon Banner === -->
    <AmazonBanner
      v-if="state.whichAdToShow.adType === 'AmazonBanner'"
      :height="(<AmazonAdObject>state.whichAdToShow)?.height ?? undefined"
      :href="(<AmazonAdObject>state.whichAdToShow).href"
      :image="getImageUrl((<AmazonAdObject>state.whichAdToShow).imagePath)"
      :imageAltText="(<AmazonAdObject>state.whichAdToShow).imageAltText"
    />

    <!-- === Mochahost Banner === -->
    <MochahostBanner
      v-if="state.whichAdToShow.adType === 'MochahostBanner'"
      :href="(<MochahostAdObject>state.whichAdToShow).href"
      :imageAltText="(<MochahostAdObject>state.whichAdToShow).imageAltText"
    />
  </div>
</template>
