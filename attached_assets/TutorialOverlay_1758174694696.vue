<template>
  <div class="tutorial-overlay" v-if="show">
    <svg class="mask-svg" width="100%" height="100%">
      <defs>
        <mask id="tutorial-mask">
          <rect width="100%" height="100%" fill="white"></rect>
          <rect :x="cutoutX" :y="cutoutY" :width="cutoutWidth" :height="cutoutHeight" fill="black"></rect>
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0.75)" mask="url(#tutorial-mask)"></rect>
    </svg>
    
    <div 
      v-for="(step, index) in steps" 
      v-show="currentStep === index"
      :key="index" 
      class="tutorial-step"
    >
      <div class="highlight-border" :style="highlightStyle"></div>
      <div class="tutorial-content" :style="contentStyle">
        <h3>{{ step.title }}</h3>
        <p>{{ step.description }}</p>
        <div class="tutorial-navigation">
          <button v-if="currentStep > 0" @click="prevStep" class="nav-btn">Previous</button>
          <button v-if="currentStep < steps.length - 1" @click="nextStep" class="nav-btn primary">Next</button>
          <button v-else @click="finishTutorial" class="nav-btn primary">Finish</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TutorialOverlay',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    steps: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentStep: 0,
      highlightElement: null,
      cutoutX: 0,
      cutoutY: 0,
      cutoutWidth: 0,
      cutoutHeight: 0,
      highlightStyle: {
        top: '0px',
        left: '0px',
        width: '0px',
        height: '0px'
      },
      contentStyle: {
        top: '0px',
        left: '0px'
      },
      resizeTimeout: null,
      scrollPosition: 0
    };
  },
  watch: {
    currentStep() {
      this.$nextTick(() => {
        this.highlightCurrentElement();
      });
    },
    show(newVal) {
      if (newVal) {
        this.currentStep = 0;
        this.$nextTick(() => {
          // هنگام شروع آموزش، اسکرول را آزاد بگذار
          this.enableScroll();
          this.highlightCurrentElement();
          this.addEventListeners();
        });
      } else {
        // هنگام پایان آموزش، اسکرول را آزاد کن
        this.enableScroll();
        this.removeEventListeners();
      }
    }
  },
  beforeDestroy() {
    // حذف فعال‌سازی مجدد اسکرول
    // this.enableScroll();
    this.removeEventListeners();
  },
  methods: {
    disableScroll() {
      // Store current scroll position
      this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      
      // Add styles to prevent scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${this.scrollPosition}px`;
      document.body.style.width = '100%';
    },
    enableScroll() {
      // Remove styles that prevent scrolling
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Restore scroll position
      if (this.scrollPosition !== undefined) {
        window.scrollTo(0, this.scrollPosition);
      }
    },
    addEventListeners() {
      // فقط به تغییر اندازه پنجره واکنش نشان می‌دهیم، نه به اسکرول
      // window.addEventListener('scroll', this.handleScroll);
      window.addEventListener('resize', this.handleResize);
    },
    removeEventListeners() {
      // window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('resize', this.handleResize);
    },
    handleResize() {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      this.resizeTimeout = setTimeout(() => {
        if (this.highlightElement) {
          this.updateHighlightPosition();
        }
      }, 100);
    },
    scrollToCurrentHighlight() {
      if (!this.highlightElement) return;
      
      const step = this.steps[this.currentStep];
      if (!step || !step.selector) return;
      
      // همیشه عنصر را مجدداً پیدا کن تا از به‌روز بودن آن مطمئن شویم
      const element = document.querySelector(step.selector);
      if (!element) return;
      
      // موقعیت عنصر را بررسی کن
      const rect = element.getBoundingClientRect();
      
      // اگر عنصر خارج از دید است یا در حاشیه صفحه است، به آن اسکرول کن
      if (rect.top < 100 || rect.bottom > window.innerHeight - 100) {
        // محاسبه موقعیت اسکرول - عنصر را در وسط صفحه قرار بده
        const targetY = window.pageYOffset + rect.top - (window.innerHeight / 2) + (rect.height / 2);
        
        // اسکرول به موقعیت هدف با سرعت بیشتر و بدون انیمیشن
        window.scrollTo({
          top: targetY,
          behavior: 'auto'
        });
        
        // به‌روزرسانی فوری موقعیت هایلایت
        this.updateHighlightPosition();
      }
    },
    updateHighlightPosition() {
      const rect = this.highlightElement.getBoundingClientRect();
      const padding = 10;
      
      // Update cutout dimensions for the SVG mask
      this.cutoutX = rect.left - padding;
      this.cutoutY = rect.top - padding;
      this.cutoutWidth = rect.width + padding * 2;
      this.cutoutHeight = rect.height + padding * 2;
      
      // Update highlight border position
      this.highlightStyle = {
        top: `${rect.top - padding}px`,
        left: `${rect.left - padding}px`,
        width: `${rect.width + padding * 2}px`,
        height: `${rect.height + padding * 2}px`
      };
      
      // Update content position
      this.updateContentPosition(rect, padding);
    },
    updateContentPosition(rect, padding) {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      
      // Calculate content position based on available space
      if (rect.bottom + 200 < windowHeight) {
        // Position below the highlighted element
        this.contentStyle = {
          top: `${rect.bottom + padding + 10}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)'
        };
      } else if (rect.top > 200) {
        // Position above the highlighted element
        this.contentStyle = {
          bottom: `${windowHeight - rect.top + padding + 10}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)'
        };
      } else if (rect.right + 300 < windowWidth) {
        // Position to the right of the highlighted element
        this.contentStyle = {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.right + padding + 10}px`,
          transform: 'translateY(-50%)'
        };
      } else {
        // Position to the left of the highlighted element
        this.contentStyle = {
          top: `${rect.top + rect.height / 2}px`,
          right: `${windowWidth - rect.left + padding + 10}px`,
          transform: 'translateY(-50%)'
        };
      }
    },
    highlightCurrentElement() {
      const step = this.steps[this.currentStep];
      if (!step || !step.selector) return;
      
      const element = document.querySelector(step.selector);
      if (!element) return;
      
      // Scroll element into view immediately
      this.scrollToElement(element);
      
      // Update highlight position immediately
      const rect = element.getBoundingClientRect();
      const padding = 10; // Add some padding around the element
      
      // Set cutout dimensions for the SVG mask
      this.cutoutX = rect.left - padding;
      this.cutoutY = rect.top - padding;
      this.cutoutWidth = rect.width + padding * 2;
      this.cutoutHeight = rect.height + padding * 2;
      
      // Set highlight border position and dimensions
      this.highlightStyle = {
        top: `${rect.top - padding}px`,
        left: `${rect.left - padding}px`,
        width: `${rect.width + padding * 2}px`,
        height: `${rect.height + padding * 2}px`
      };
      
      // Update content position
      this.updateContentPosition(rect, padding);
      
      this.highlightElement = element;
      
      // Double-check position after a short delay to ensure everything is in place
      setTimeout(() => {
        this.updateHighlightPosition();
      }, 50);
    },
    
    scrollToElement(element) {
      // Check if element is fully visible in viewport
      const rect = element.getBoundingClientRect();
      const isFullyVisible = (
        rect.top >= 100 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight - 100 &&
        rect.right <= window.innerWidth
      );
      
      // If not fully visible, scroll to it
      if (!isFullyVisible) {
        // Calculate the target scroll position - center the element
        const targetY = window.pageYOffset + rect.top - (window.innerHeight / 2) + (rect.height / 2);
        
        // اسکرول فوری و بدون انیمیشن
        window.scrollTo({
          top: targetY,
          behavior: 'auto'
        });
      }
    },
    
    nextStep() {
      if (this.currentStep < this.steps.length - 1) {
        // قبل از تغییر مرحله، اسکرول را آزاد کن
        this.enableScroll();
        
        // ذخیره مرحله فعلی قبل از افزایش
        const fromStep = this.currentStep;
        
        // در حالت موبایل، اگر در مرحله 1 هستیم، مستقیماً به مرحله 3 برو (مرحله 2 را رد کن)
        if (fromStep === 0 && window.innerWidth < 1100) {
          console.log('Skipping step 2 on mobile, going directly to step 3');
          this.currentStep = 2; // مستقیماً به مرحله 3 برو
        } else {
          // افزایش عادی مرحله
          this.currentStep++;
        }

        console.log('nextStep - fromStep:', fromStep, 'toStep:', this.currentStep, 'innerWidth:', window.innerWidth);

        // اگر از مرحله 2 به مرحله 3 می‌رویم و در حالت موبایل هستیم، منوی موبایل را ببند
        if (fromStep === 1 && this.currentStep === 2 && window.innerWidth < 1100) {
          console.log('Closing mobile menu in step 3');
          setTimeout(() => {
            this.toggleMobileMenu(false);
          }, 300);
        }
      }
    },
    
    prevStep() {
      if (this.currentStep > 0) {
        // قبل از تغییر مرحله، اسکرول را آزاد کن
        this.enableScroll();
        
        // ذخیره مرحله فعلی قبل از کاهش
        const fromStep = this.currentStep;
        
        // در حالت موبایل، اگر در مرحله 3 هستیم، مستقیماً به مرحله 1 برو (مرحله 2 را رد کن)
        if (fromStep === 2 && window.innerWidth < 1100) {
          console.log('Skipping step 2 on mobile, going directly to step 1');
          this.currentStep = 0; // مستقیماً به مرحله 1 برو
        } else {
          // کاهش عادی مرحله
          this.currentStep--;
        }
        
        console.log('prevStep - fromStep:', fromStep, 'toStep:', this.currentStep, 'innerWidth:', window.innerWidth);
      }
    },
    
    toggleMobileMenu(show) {
      console.log('toggleMobileMenu called with show =', show);
      
      // روش مستقیم: تغییر مستقیم وضعیت منو با دسترسی به DOM
      try {
        // یافتن منوی موبایل
        const mobileMenu = document.querySelector('.topNav .mobileMenu');
        if (mobileMenu) {
          console.log('Found mobile menu element');
          const currentlyShown = mobileMenu.classList.contains('show');
          console.log('Current menu state:', currentlyShown ? 'shown' : 'hidden');
          
          if (show && !currentlyShown) {
            // باز کردن منو با کلیک روی دکمه
            const menuToggler = document.querySelector('.topNav .menuToggler');
            if (menuToggler) {
              console.log('Clicking menu toggler to open');
              menuToggler.click();
            } else {
              // اگر دکمه پیدا نشد، مستقیماً کلاس را اضافه کن
              console.log('Menu toggler not found, adding show class directly');
              mobileMenu.classList.add('show');
              
              // همچنین متغیر showMenu را در کامپوننت topNav تنظیم کن
              const topNavElement = document.querySelector('.topNav');
              if (topNavElement && topNavElement.__vue__) {
                topNavElement.__vue__.showMenu = true;
              }
            }
          } else if (!show && currentlyShown) {
            // بستن منو با کلیک روی دکمه
            const menuToggler = document.querySelector('.topNav .menuToggler');
            if (menuToggler) {
              console.log('Clicking menu toggler to close');
              menuToggler.click();
            } else {
              // اگر دکمه پیدا نشد، مستقیماً کلاس را حذف کن
              console.log('Menu toggler not found, removing show class directly');
              mobileMenu.classList.remove('show');
              
              // همچنین متغیر showMenu را در کامپوننت topNav تنظیم کن
              const topNavElement = document.querySelector('.topNav');
              if (topNavElement && topNavElement.__vue__) {
                topNavElement.__vue__.showMenu = false;
              }
            }
          }
        } else {
          console.error('Mobile menu element not found');
        }
      } catch (error) {
        console.error('Error toggling mobile menu:', error);
      }
      
      // روش 2: استفاده از رویداد سراسری (به عنوان پشتیبان)
      if (this.$root.$on && this.$root.$on["toggle-mobile-menu"]) {
        console.log('Using global event to toggle menu');
        this.$root.$on["toggle-mobile-menu"](show);
      }
    },
    finishTutorial() {
      localStorage.setItem('tutorialCompleted', 'true');
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.tutorial-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  pointer-events: none;
}

.mask-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
}

.tutorial-step {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.highlight-border {
  position: absolute;
  border: 2px solid #5cf2a3;
  border-radius: 8px;
  box-shadow: 0 0 0 2px rgba(92, 242, 163, 0.5);
  pointer-events: none;
  z-index: 2;
  animation: glow 2s infinite;
  backdrop-filter: brightness(1.2);
}

@keyframes glow {
  0% {
    box-shadow: 0 0 0 2px rgba(92, 242, 163, 0.5);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(92, 242, 163, 0.8);
  }
  100% {
    box-shadow: 0 0 0 2px rgba(92, 242, 163, 0.5);
  }
}

.tutorial-content {
  position: absolute;
  background-color: #131019;
  color: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 350px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  pointer-events: auto;
  z-index: 3;
  border: 1px solid rgba(92, 242, 163, 0.5);
  transition: all 0.3s ease;
}

.tutorial-content h3 {
  margin-top: 0;
  color: #5cf2a3;
  font-size: 20px;
  margin-bottom: 12px;
  font-weight: 600;
}

.tutorial-content p {
  color: #ffffff;
  margin-bottom: 24px;
  line-height: 1.5;
  font-size: 16px;
}

.tutorial-navigation {
  display: flex;
  justify-content: space-between;
}

.nav-btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid #333;
  background-color: #222;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-btn.primary {
  background-color: #5cf2a3;
  color: #070707;
  border-color: #5cf2a3;
}

.nav-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* Mobile responsive styles */
@media (max-width: 1100px) {
  .tutorial-content {
    max-width: 85%;
    padding: 18px;
    left: 50% !important;
    transform: translateX(-50%) !important;
    bottom: 20px !important;
    top: auto !important;
    right: auto !important;
  }

  .tutorial-content h3 {
    font-size: 18px;
  }

  .tutorial-content p {
    font-size: 14px;
    margin-bottom: 18px;
  }

  .nav-btn {
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>