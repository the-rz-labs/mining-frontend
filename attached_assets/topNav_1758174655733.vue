<template>
  <div class="topNav">
    <div class="topNavContainer">
      <router-link to="/" class="containerLogo">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="178"
          height="50"
          viewBox="0 0 178 50"
          fill="none"
        >
          <rect width="178" height="50" fill="url(#pattern0_2_2236)" />
          <defs>
            <pattern
              id="pattern0_2_2236"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <use
                xlink:href="#image0_2_2236"
                transform="scale(0.00561798 0.02)"
              />
            </pattern>
            <image
              id="image0_2_2236"
              width="178"
              height="61"
              preserveAspectRatio="none"
              xlink:href="data:image/png;base64,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"
            />
          </defs>
        </svg>
      </router-link>
      <div class="containerLinks">
        <div class="linksWrapper">
          <div class="linkThumb" @click="scrollToSection('home')">Home</div>
          <div class="linkThumb" @click="scrollToSection('plans')">
            Mining Plans
          </div>
          <div class="linkThumb" @click="scrollToSection('tokens')">Tokens</div>
          <div class="linkThumb" @click="scrollToSection('ranking')">
            Ranking Integration
          </div>
          <div class="linkThumb" @click="scrollToSection('inivitation')">
            Invite & Rewards
          </div>
          <!-- <div class="linkThumb" @click="scrollToSection('')">VIP</div> -->
          <div class="linkThumb" @click="goToContactPage()">
            Contacts
          </div>
          <div class="linkThumb" @click="startTutorial">
            Help
          </div>
        </div>
      </div>
      <div class="containerLogin">
        <button v-if="!isLoggedIn" class="loginBtn" @click="showLoginModal">
          <VsxIcon
            iconName="ProfileCircle"
            :size="24"
            color="#000"
            type="bold"
          />
          <span>Login/Registration</span>
        </button>
        <a v-else :href="userInfo && userInfo.is_admin ? 'https://coinmaining.game/backend/admin' : '#'" @click="handleProfileClick" class="logoutBtn">
          <VsxIcon iconName="User" :size="24" color="#131019" type="bold" />
          <span>Profile</span>
        </a>
        <div class="menuToggler" @click="showMenuHandler">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="16"
            viewBox="0 0 20 16"
          >
            <g id="menu" transform="translate(-333.38 -32.333)">
              <path
                id="Vector"
                d="M27.38,0h-18"
                transform="translate(325 33.333)"
                fill="none"
                stroke="#fff"
                stroke-linecap="round"
                stroke-width="2"
              />
              <path
                id="Vector-2"
                data-name="Vector"
                d="M19.109,0H5"
                transform="translate(333.271 40.333)"
                fill="none"
                stroke="#fff"
                stroke-linecap="round"
                stroke-width="2"
              />
              <path
                id="Vector-3"
                data-name="Vector"
                d="M24,0H6"
                transform="translate(328.381 47.333)"
                fill="none"
                stroke="#fff"
                stroke-linecap="round"
                stroke-width="2"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
    <div
      class="mobileMenu"
      :class="{ show: showMenu }"
      @click="showMenuHandler"
    >
      <div class="menuWrapper" @click.stop>
        <div class="wrapperHeader">
          <div class="headerContainer">
            <div class="headerLogo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="178"
                height="50"
                viewBox="0 0 178 50"
                fill="none"
              >
                <rect width="178" height="50" fill="url(#pattern0_2_2236)" />
                <defs>
                  <pattern
                    id="pattern0_2_2236"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use
                      xlink:href="#image0_2_2236"
                      transform="scale(0.00561798 0.02)"
                    />
                  </pattern>
                  <image
                    id="image0_2_2236"
                    width="178"
                    height="61"
                    preserveAspectRatio="none"
                    xlink:href="data:image/png;base64,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"
            />
          </defs>
        </svg>
            </div>
            <div class="headerCloseBtn" @click="showMenuHandler">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
        </div>
        <div class="wrapperMain">
          <div class="mainLinks">
            <div class="linkThumb" @click="scrollToSection('home')">
              <VsxIcon
                iconName="Home"
                :size="20"
                color="#fff"
                type="bold"
              />Home
            </div>
            <div class="linkThumb" @click="scrollToSection('plans')">
              <VsxIcon
                iconName="Cpu"
                :size="20"
                color="#fff"
                type="bold"
              />Mining Plans
            </div>
            <div class="linkThumb" @click="scrollToSection('tokens')">
              <VsxIcon
                iconName="Coin1"
                :size="20"
                color="#fff"
                type="bold"
              />Tokens
            </div>
            <div class="linkThumb" @click="scrollToSection('ranking')">
              <VsxIcon
                iconName="FavoriteChart"
                :size="20"
                color="#fff"
                type="bold"
              />Ranking Integration
            </div>
            <div class="linkThumb" @click="scrollToSection('invitation')">
              <VsxIcon
                iconName="UserCirlceAdd"
                :size="20"
                color="#fff"
                type="bold"
              />Invite & Rewards
            </div>
            <!-- <div class="linkThumb" @click="scrollToSection('')">
              <VsxIcon
                iconName="Crown"
                :size="20"
                color="#fff"
                type="bold"
              />VIP</div
            > -->
            <div class="linkThumb" @click="goToContactPage">
              <VsxIcon
                iconName="People"
                :size="20"
                color="#fff"
                type="bold"
              />Contacts
            </div>
            <div class="linkThumb" @click="startTutorial">
              <VsxIcon
                iconName="InfoCircle"
                :size="20"
                color="#fff"
                type="bold"
              />Help
            </div>
            <div v-if="!isLoggedIn" class="loginBtn" @click="showLoginModal">
              <VsxIcon
                iconName="ProfileCircle"
                :size="24"
                color="#000"
                type="bold"
              />
              <span>Login/Registration</span>
            </div>
            <a
              v-else
              :href="userInfo && userInfo.is_admin ? 'https://coinmaining.game/backend/admin' : '#'"
              @click="handleProfileClick"
              class="loginBtn"
            >
              <VsxIcon iconName="User" :size="24" color="#131019" type="bold" />
              <span>Profile</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <LoginUser v-if="showLogin" @close="closeLoginModal" />
  </div>
</template>

<script>
import LoginUser from "./LoginUser.vue";
import { get } from "../helpers/http";

export default {
  name: "topNav",
  components: {
    LoginUser,
  },
  data() {
    return {
      showMenu: false,
      showLogin: false,
      userInfo: null,
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.auth && this.$store.state.auth.loggedIn;
    },
  },
  methods: {
    showMenuHandler() {
      this.showMenu = !this.showMenu;
    },
    startTutorial() {
      this.showMenu = false;
      
      // Check if we're on the wallet details page
      if (this.$route.path === '/wallet') {
        if (this.$root.$on && this.$root.$on["start-wallet-tutorial"]) {
          this.$root.$on["start-wallet-tutorial"]();
        }
      } else {
        if (this.$root.$on && this.$root.$on["start-tutorial"]) {
          this.$root.$on["start-tutorial"]();
        }
      }
    },
    showLoginModal() {
      this.showMenu = false;
      if (this.$root.$on && this.$root.$on["login-modal"]) {
        this.$root.$on["login-modal"](true);
      }
    },
    closeLoginModal() {
      this.showLogin = false;
    },
    scrollToSection(sectionId) {
      this.showMenu = false;

      // Check if we're not on the home page, navigate first
      if (this.$route.path !== "/") {
        this.$router.push("/");

        // Add 50ms timeout before scrolling
        setTimeout(() => {
          this.$emit("scroll-to", sectionId);
        }, 50);
      } else {
        // Already on home page, just emit the scroll event
        this.$emit("scroll-to", sectionId);
      }
    },
    getUserInfo() {
      if (this.isLoggedIn) {
        get("/users/me/")
          .then((response) => {
            if (response) {
              this.userInfo = response;
            }
          })
          .catch((error) => {
            console.error("Error fetching user info:", error);
          });
      }
    },
    handleProfileClick(event) {
      if (this.userInfo && this.userInfo.is_admin) {
        // Let the default href handle the navigation to admin panel
      } else {
        // Prevent default and navigate to profile page
        event.preventDefault();
        this.$router.push('/profile');
        this.showMenu = false;
      }
    },
    goToContactPage() {
      this.$router.push('/contact-us');
      this.showMenu = false;
    }
  },
  created() {
    // Ensure auth state is initialized
    if (!this.$store.state.auth) {
      this.$store.commit("checkAuth");
    }
    
    // Get user info if logged in
    this.getUserInfo();
    
    // Listen for login success events
    this.$root.$on = this.$root.$on || {};
    this.$root.$on["refresh-user-data"] = () => {
      this.getUserInfo();
    };
    
    // گوش دادن به رویداد toggle-mobile-menu از TutorialOverlay
    this.$root.$on["toggle-mobile-menu"] = (show) => {
      this.showMenu = show;
    };
  },
  watch: {
    isLoggedIn(newVal) {
      if (newVal) {
        this.getUserInfo();
      } else {
        this.userInfo = null;
      }
    }
  }
};
</script>

<style scoped>
</style>
