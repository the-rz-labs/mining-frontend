<template>
  <section id="plans" class="py-12">
    <div class="text-center mb-8">
      <h2 class="text-4xl font-extrabold">Mining Plans</h2>
    </div>

    <div class="relative">
      <button
        class="absolute z-10 top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="prevSlide"
        :disabled="currentSlide === 0"
        aria-label="Previous plans"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div class="overflow-hidden" ref="sliderWrapper">
        <div
          class="flex transition-transform duration-300 ease-in-out"
          :style="{ transform: `translateX(-${currentSlide * itemWidth}px)` }"
        >
          <div
            v-for="(plan, index) in plans"
            :key="index"
            class="flex-shrink-0 p-4"
            :style="{ width: `${itemWidth}px` }"
          >
            <div
              class="relative bg-gray-800 rounded-xl p-6 shadow-xl overflow-hidden group transform transition-all duration-300 hover:scale-105"
            >
              <div class="absolute inset-0 bg-cover opacity-20" :style="{ backgroundImage: 'url(/img/plansStarBg.png)' }"></div>
              <div class="relative z-10 flex flex-col items-center text-center">
                <div class="relative w-40 h-40 mb-4">
                  <img :src="plan.image" alt="minor" class="w-full h-full object-contain transition-opacity duration-300 group-hover:opacity-0" />
                  <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <img src="/img/mineHover.gif" alt="mineHover" class="w-full h-full object-contain" />
                  </div>
                </div>
                <h3 class="text-2xl font-bold text-teal-400 mb-2">{{ plan.name }}</h3>
                <p class="text-gray-400">Power: {{ plan.power }} MH/s</p>
                <p class="text-gray-400 mb-4">Hold: {{ plan.price }} {{ getCurrencySymbol(plan) }}</p>
                <button
                  class="bg-orange-500 text-gray-900 font-bold py-2 px-6 rounded-full hover:bg-orange-400 transition-colors"
                  @click="$emit('startMining', plan)"
                >
                  Start Mining
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <button
        class="absolute z-10 top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="nextSlide"
        :disabled="currentSlide >= plans.length - itemsToShow"
        aria-label="Next plans"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <div class="flex justify-center mt-6 space-x-2" v-if="plans.length > itemsToShow">
      <button
        v-for="(_, index) in dotGroups"
        :key="index"
        class="h-2 w-2 rounded-full transition-colors"
        :class="{'bg-teal-400': index === currentDot, 'bg-gray-600': index !== currentDot}"
        @click="currentSlide = index * itemsToShow"
        :aria-label="'Go to slide group ' + (index + 1)"
      ></button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  plans: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(['startMining']);

const currentSlide = ref(0);
const sliderWrapper = ref(null);
const itemsToShow = ref(3);
const itemWidth = ref(0);

const updateSliderDimensions = () => {
  if (!sliderWrapper.value) return;
  const width = sliderWrapper.value.clientWidth;
  
  if (width < 640) { // sm
    itemsToShow.value = 1;
  } else if (width < 1024) { // lg
    itemsToShow.value = 2;
  } else {
    itemsToShow.value = 3;
  }
  itemWidth.value = width / itemsToShow.value;
};

onMounted(() => {
  updateSliderDimensions();
  window.addEventListener('resize', updateSliderDimensions);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateSliderDimensions);
});

// Reset slide position if itemsToShow changes due to screen resize
watch(itemsToShow, () => {
  currentSlide.value = Math.floor(currentSlide.value / itemsToShow.value) * itemsToShow.value;
});

// Slider navigation methods
const nextSlide = () => {
  if (currentSlide.value < props.plans.length - itemsToShow.value) {
    currentSlide.value++;
  }
};

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
};

// Pagination dot logic
const dotGroups = computed(() => {
  return Math.ceil(props.plans.length / itemsToShow.value);
});

const currentDot = computed(() => {
  return Math.floor(currentSlide.value / itemsToShow.value);
});

const getCurrencySymbol = (plan) => {
  // Your currency logic
  return plan.currency || 'USD';
};
</script>