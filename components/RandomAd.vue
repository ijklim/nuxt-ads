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
    // === Amazon Bounty ===
    amazonAudiblePlus: {
      adType: 'AmazonBanner',
      href: 'https://www.amazon.com/dp/B00NB86OYE/?ref_=assoc_tag_ph_1485906643682&_encoding=UTF8&camp=1789&creative=9325&linkCode=pf4&tag=aimprove-20&linkId=837a9441c1d588564e1289af56177cff',
      imagePath: 'Amazon/Minerva-Plus-Associate-300x250-V08.png',
      imageAltText: 'Try Audible Premium Plus and Get Up to Two Free Audiobooks',
      displayRatio: 1,
    },
    amazonFamily: {
      adType: 'AmazonBanner',
      href: 'https://www.amazon.com/gp/family/signup/welcome?ie=UTF8&*Version*=1&*entries*=0&ref_=assoc_tag_ph_1457104784749&_encoding=UTF8&camp=1789&creative=9325&linkCode=pf4&tag=aimprove-20&linkId=20968e1f5b6ffc1c3bd5652f143047a9',
      imagePath: 'Amazon/33385_mom_ads_300x250_v2.png',
      imageAltText: 'Join Amazon Family 30-Day Free Trial',
      displayRatio: 1,
    },
    amazonFresh: {
      adType: 'AmazonBanner',
      href: 'https://www.amazon.com/fresh?ref_=assoc_tag_ph_1524254357421&_encoding=UTF8&camp=1789&creative=9325&linkCode=pf4&tag=aimprove-20&linkId=48b224a906b66a17d7bc2f4e0e9b7b01',
      imagePath: 'Amazon/AZUS23-100k-0603-Amazon-EBT-H2-AssociateBanners_Set1_300x250_V01.jpg',
      imageAltText: 'Try Amazon Fresh',
      displayRatio: 1,
    },
    amazonPrime: {
      adType: 'AmazonBanner',
      href: 'https://www.amazon.com/gp/video/primesignup?ref_=assoc_tag_ph_1402131641212&_encoding=UTF8&camp=1789&creative=9325&linkCode=pf4&tag=aimprove-20&linkId=98998df7a905a304cfc12dcfc2991a46',
      imagePath: 'Amazon/AssocAds_GleasonSVOD_300x250.jpg',
      imageAltText: 'Join Amazon Prime - Watch Thousands of Movies & TV Shows Anytime - Start Free Trial Now',
      displayRatio: 1,
    },
    amazonPrimeStudent: {
      adType: 'AmazonBanner',
      href: 'https://www.amazon.com/gp/student/signup/info/?ref_=assoc_tag_ph_1402130811706&_encoding=UTF8&camp=1789&creative=9325&linkCode=pf4&tag=aimprove-20&linkId=06890d150e8415a2ead6189b18a0f7ca',
      imagePath: 'Amazon/1028240_student_v5a_associate_300x250.jpg',
      imageAltText: 'Amazon Prime Student 6-month Trial',
      displayRatio: 1,
    },
    amazonWeddingRegistry: {
      adType: 'AmazonBanner',
      href: 'https://www.amazon.com/wedding/home?ref_=assoc_tag_ph_1524238801480&_encoding=UTF8&camp=1789&creative=9325&linkCode=pf4&tag=aimprove-20&linkId=4a99f2be4192accb32590c6ac3e1424c',
      imagePath: 'Amazon/AWR_Associate_Central-1.jpg',
      imageAltText: 'Create an Amazon Wedding Registry',
      displayRatio: 1,
    },

    // === Amazon Product ===
    amazonProductFullstarVegetableChopper: {
      adType: 'AmazonBanner',
      height: 344,
      href: 'https://www.amazon.com/Fullstar-Vegetable-Chopper-Spiralizer-Container/dp/B0C1T6J3CS?&_encoding=UTF8&tag=aimprove-20&linkCode=ur2&linkId=5a931ba01d93ed4d53d7577344c8dbd4&camp=1789&creative=9325',
      imagePath: 'Amazon/FullstarVegetableChopper.webp',
      imageAltText: 'Fullstar Vegetable Chopper',
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
      displayRatio: 5,
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
