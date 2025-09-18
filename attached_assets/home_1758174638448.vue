<template>
  <div>
    <div class="homePage">
      <header id="home" class="header">
        <div class="headerBg leftBg">
          <img src="../assets/image/headerBgLeft.png" alt="headerBgLeft" />
        </div>
        <div class="headerBg rightBg">
          <img src="../assets/image/headerBgRight.png" alt="headerBgLeft" />
        </div>
        <div class="headerContainer">
          <div class="containerContent">
            <h1 class="contentTitle">
              <span>Stake Your RZ Tokens</span>
              <span>Upgrade Miners</span>
              <span>Earn Daily Rewards</span>
            </h1>
            <div class="contentBtnsWrapper">
              <div class="contentBtn" @click="handleStartMiningClick">Start Mining</div>
              <div class="contentBtn lightBtn" @click="scrollToSection('ranking')">Connect Ranking Account</div>
            </div>
          </div>
          <div class="containerPic">
            <img src="../assets/image/headerPic.png" alt="headerPic" />
          </div>
        </div>
      </header>
      <main class="main">
        <div class="mainContainer">
          <div id="tokens" class="containerOutput">
            <div class="outputContainer">
              <div class="containerThumb">
                <div class="thumbIcon">
                  <VsxIcon
                    iconName="Profile2User"
                    :size="50"
                    color="#5cf2a3"
                    type="bold"
                  />
                </div>
                <div class="thumbContent">
                  <h2 class="contentTitle">{{ stakesList.total_users }}</h2>
                  <div class="contenttValue">Total Users</div>
                </div>
              </div>
              <div class="containerThumb">
                <div class="thumbIcon">
                  <VsxIcon
                    iconName="EthereumClassic"
                    :size="50"
                    color="#5cf2a3"
                    type="bold"
                  />
                </div>
                <div class="thumbContent">
                  <h2 class="contentTitle">{{ stakesList.total_staked }}</h2>
                  <div class="contenttValue">Token Staked</div>
                </div>
              </div>
              <div class="containerThumb">
                <div class="thumbIcon">
                  <VsxIcon
                    iconName="Cpu"
                    :size="50"
                    color="#5cf2a3"
                    type="bold"
                  />
                </div>
                <div class="thumbContent">
                  <h2 class="contentTitle">{{ stakesList.online_miners }}</h2>
                  <div class="contenttValue">Online Miners</div>
                </div>
              </div>
              <div class="containerThumb">
                <div class="thumbIcon">
                  <VsxIcon
                    iconName="MoneySend"
                    :size="50"
                    color="#5cf2a3"
                    type="bold"
                  />
                </div>
                <div class="thumbContent">
                  <h2 class="contentTitle">
                    {{ stakesList.total_rewards_paid }}
                  </h2>
                  <div class="contenttValue">Total Rewards Paid</div>
                </div>
              </div>
            </div>
          </div>
          <div id="plans" class="containerPlansList">
            <div class="plansListContainer">
              <h2 class="plansListTitle">Mining Plans</h2>
              <div class="plansList">
                <div
                  class="custom-slider"
                  :class="sliderClasses"
                  :style="sliderStyle"
                  role="region"
                  aria-label="Mining Plans Slider"
                  aria-live="polite"
                  tabindex="0"
                  @keydown="handleKeyDown"
                >
                  <!-- Navigation buttons -->
                  <button
                    class="slider-nav slider-prev"
                    @click="prevSlide"
                    :disabled="currentSlide === 0"
                    aria-label="Previous plans"
                    :aria-disabled="currentSlide === 0"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>

                  <!-- Slider track -->
                  <div
                    class="slider-track"
                    ref="sliderTrack"
                    :style="{ transform: `translateX(-${currentSlide * slideWidth}px)`, cursor: isDragging ? 'grabbing' : 'grab' }"
                    role="group"
                    aria-label="Plans carousel"
                    :aria-describedby="'slide-info-' + currentSlide"
                    @mousedown="handleMouseDown"
                    @mousemove="handleMouseMove"
                    @mouseup="handleMouseUp"
                    @mouseleave="handleMouseLeave"
                    @touchstart="handleTouchStart"
                    @touchmove="handleTouchMove"
                    @touchend="handleTouchEnd"
                  >
                    <div
                      v-for="(v, i) in plansList"
                      :key="i"
                      class="plansThumb slider-slide"
                      :class="planClasses(i)"
                    >
                      <div class="thumbBg">
                        <img
                          src="../assets/image/plansStarBg.png"
                          alt="plansStar"
                        />
                      </div>
                      <div class="thumbPic">
                        <img :src="v.image" alt="minorYellow" class="plan-image" />
                        <!-- Hover overlay with backMine background and mineHover gif -->
                        <div class="hover-overlay">
                          <div class="hover-background">
                            <img src="/img/backMine.png" alt="backMine" class="back-mine" />
                          </div>
                          <div class="hover-gif">
                            <img src="/img/mineHover.gif" alt="mineHover" class="mine-hover-gif" />
                          </div>
                        </div>
                        <div class="picBackBg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="738"
                            height="738"
                            viewBox="0 0 738 738"
                            fill="none"
                          >
                            <g filter="url(#filter0_f_24_448)">
                              <circle
                                cx="369"
                                cy="369"
                                r="149"
                                fill="white"
                                fill-opacity="0.6"
                              />
                            </g>
                            <defs>
                              <filter
                                id="filter0_f_24_448"
                                x="0"
                                y="0"
                                width="738"
                                height="738"
                                filterUnits="userSpaceOnUse"
                                color-interpolation-filters="sRGB"
                              >
                                <feFlood
                                  flood-opacity="0"
                                  result="BackgroundImageFix"
                                />
                                <feBlend
                                  mode="normal"
                                  in="SourceGraphic"
                                  in2="BackgroundImageFix"
                                  result="shape"
                                />
                                <feGaussianBlur
                                  stdDeviation="110"
                                  result="effect1_foregroundBlur_24_448"
                                />
                              </filter>
                            </defs>
                          </svg>
                        </div>
                      </div>
                      <div class="thumbContent">
                        <div class="contentHeader">{{ v.name }}</div>
                        <div class="contentMain">
                          <div class="mainDesc">Power: {{ v.power }} MH/s</div>
                          <div class="mainDesc">Hold: {{ v.price }} {{ getCurrencySymbol(v) }}</div>
                        </div>
                        <div class="contentFooter">
                          <button
                            class="miningBtn"
                            @click="showDialogHandler(v, i)"
                          >
                            Start Mining
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Navigation buttons -->
                  <button
                    class="slider-nav slider-next"
                    @click="nextSlide"
                    :disabled="currentSlide >= plansList.length - slidesToShow"
                    aria-label="Next plans"
                    :aria-disabled="currentSlide >= plansList.length - slidesToShow"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>

                <!-- Dots indicator -->
                <div
                  class="slider-dots"
                  v-if="plansList.length > slidesToShow && totalDotGroups <= 7"
                  role="tablist"
                  aria-label="Slide indicators"
                >
                  <button
                    v-for="(dot, index) in totalDotGroups"
                    :key="index"
                    class="slider-dot"
                    :class="{ active: index === Math.floor(currentSlide / slidesToShow) }"
                    @click="currentSlide = index * slidesToShow"
                    :aria-label="'Go to slide group ' + (index + 1)"
                    role="tab"
                    :aria-selected="index === Math.floor(currentSlide / slidesToShow)"
                  ></button>
                </div>

                <!-- Screen reader info -->
                <div id="slider-info" class="sr-only" aria-live="polite" aria-atomic="true">
                  Slide {{ currentSlide + 1 }} of {{ plansList.length }}
                </div>
              </div>
            </div>
          </div>
          <div id="inivitation" class="invitationForm">
            <div class="formContainer">
              <div class="containerTopThumb">
                <div class="thumbTitleWrapper">
                  <div class="thumbTitle">
                    <VsxIcon
                      iconName="Profile2User"
                      :size="46"
                      color="#FF8E49"
                      type="bold"
                    />
                    <span>Invite Your Friends</span>
                  </div>
                  <div class="thumbSubTitle">
                    Send The Invitation Code To Invite Others And Boost Your
                    Mining Power.
                  </div>
                </div>
                <div class="thumbMain">
                  <div class="codeWrapper">
                    <div class="invitationCode">{{ referralCode.referral_code || 'Login Required' }}</div>
                    <div class="inviteCodeBtn" @click="copyInviteLink">
                      <VsxIcon
                        iconName="Copy"
                        :size="32"
                        color="#070707"
                        type="linear"
                      />
                      <span>copy referral link</span>
                    </div>
                  </div>
                  <div class="mediaWrapper">
                    <a 
                      :href="this.$store.state.contactInfo && this.$store.state.contactInfo.facebook ? this.$store.state.contactInfo.facebook : '#'" 
                      class="mediaThumb"
                      target="_blank"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.2137 13.3283L17.8356 9.23311H13.9452V6.5768C13.9452 5.45617 14.4877 4.3632 16.2301 4.3632H18V0.876797C18 0.876797 16.3945 0.600098 14.8603 0.600098C11.6548 0.600098 9.56164 2.56189 9.56164 6.11194V9.23311H6V13.3283H9.56164V23.2285C10.2767 23.342 11.0082 23.4001 11.7534 23.4001C12.4986 23.4001 13.2301 23.342 13.9452 23.2285V13.3283H17.2137Z"
                          fill="#FF8E49"
                        />
                      </svg>
                    </a>
                    <a
                      :href="
                        this.$store.state.contactInfo
                          ? this.$store.state.contactInfo.twitter
                          : '#'
                      "
                      class="mediaThumb"
                      target="_blank"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21.057 7.18066C21.0663 7.39186 21.0663 7.59346 21.0663 7.80466C21.0755 14.2079 16.3711 21.5999 7.76781 21.5999C5.23036 21.5999 2.73921 20.8415 0.599976 19.4207C0.970406 19.4687 1.34084 19.4879 1.71127 19.4879C3.81346 19.4879 5.86009 18.7583 7.51777 17.4047C5.51744 17.3663 3.7579 16.0127 3.14669 14.0351C3.8505 14.1791 4.57284 14.1503 5.25814 13.9487C3.08186 13.5071 1.51679 11.5199 1.50753 9.20626C1.50753 9.18706 1.50753 9.16786 1.50753 9.14866C2.15578 9.52306 2.88738 9.73426 3.62825 9.75346C1.58162 8.33266 0.942624 5.50065 2.18357 3.28304C4.56358 6.31665 8.06415 8.15026 11.824 8.35186C11.4443 6.67185 11.9629 4.90545 13.1761 3.71505C15.056 1.88144 18.0195 1.97744 19.7975 3.92625C20.844 3.71505 21.8534 3.31184 22.7702 2.74544C22.4183 3.86865 21.6867 4.81905 20.7144 5.42385C21.6404 5.30865 22.548 5.04945 23.4 4.66545C22.7702 5.64465 21.9738 6.48945 21.057 7.18066Z"
                          fill="#FF8E49"
                        />
                      </svg>
                    </a>
                    <a
                      :href="
                        this.$store.state.contactInfo
                          ? this.$store.state.contactInfo.instagram
                          : '#'
                      "
                      class="mediaThumb"
                      target="_blank"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <g clip-path="url(#clip0_20_573)">
                          <path
                            d="M12 2.16276C15.206 2.16276 15.5824 2.17705 16.8496 2.23422C18.0215 2.28662 18.655 2.48194 19.079 2.64867C19.6411 2.8678 20.0413 3.12505 20.4605 3.54426C20.8797 3.96348 21.1417 4.36364 21.3561 4.92576C21.5181 5.34974 21.7182 5.98333 21.7706 7.15522C21.8277 8.42239 21.842 8.79873 21.842 12.0048C21.842 15.2108 21.8277 15.5871 21.7706 16.8543C21.7182 18.0262 21.5228 18.6598 21.3561 19.0838C21.137 19.6459 20.8797 20.046 20.4605 20.4653C20.0413 20.8845 19.6411 21.1465 19.079 21.3609C18.655 21.5228 18.0215 21.7229 16.8496 21.7753C15.5824 21.8325 15.206 21.8468 12 21.8468C8.79397 21.8468 8.41763 21.8325 7.15046 21.7753C5.97857 21.7229 5.34498 21.5276 4.921 21.3609C4.35888 21.1417 3.95872 20.8845 3.5395 20.4653C3.12029 20.046 2.85828 19.6459 2.64391 19.0838C2.48194 18.6598 2.28186 18.0262 2.22946 16.8543C2.17229 15.5871 2.158 15.2108 2.158 12.0048C2.158 8.79873 2.17229 8.42239 2.22946 7.15522C2.28186 5.98333 2.47718 5.34974 2.64391 4.92576C2.86304 4.36364 3.12029 3.96348 3.5395 3.54426C3.95872 3.12505 4.35888 2.86304 4.921 2.64867C5.34498 2.4867 5.97857 2.28662 7.15046 2.23422C8.41763 2.17229 8.79874 2.16276 12 2.16276ZM12 0C8.74157 0 8.33188 0.0142914 7.05042 0.0714569C5.77372 0.128622 4.90195 0.333466 4.13974 0.628821C3.34895 0.933704 2.68202 1.34815 2.01509 2.01509C1.34816 2.68202 0.938468 3.35371 0.628821 4.13974C0.333466 4.90195 0.128623 5.77372 0.071457 7.05518C0.0142914 8.33188 0 8.74156 0 12C0 15.2584 0.0142914 15.6681 0.071457 16.9496C0.128623 18.2263 0.333466 19.0981 0.628821 19.865C0.933705 20.6558 1.34816 21.3227 2.01509 21.9897C2.68202 22.6566 3.35371 23.0663 4.13974 23.3759C4.90195 23.6713 5.77372 23.8761 7.05519 23.9333C8.33665 23.9905 8.74157 24.0048 12.0048 24.0048C15.268 24.0048 15.6729 23.9905 16.9544 23.9333C18.2311 23.8761 19.1028 23.6713 19.8698 23.3759C20.6606 23.0711 21.3275 22.6566 21.9945 21.9897C22.6614 21.3227 23.0711 20.6511 23.3807 19.865C23.6761 19.1028 23.8809 18.231 23.9381 16.9496C23.9953 15.6681 24.0095 15.2632 24.0095 12C24.0095 8.7368 23.9953 8.33188 23.9381 7.05042C23.8809 5.77372 23.6761 4.90194 23.3807 4.13497C23.0758 3.34418 22.6614 2.67725 21.9945 2.01032C21.3275 1.34339 20.6558 0.933704 19.8698 0.624057C19.1076 0.328702 18.2358 0.123859 16.9544 0.0666931C15.6681 0.0142914 15.2584 0 12 0Z"
                            fill="#FF8E49"
                          />
                          <path
                            d="M12 2.16276C15.206 2.16276 15.5824 2.17705 16.8496 2.23422C18.0215 2.28662 18.655 2.48194 19.079 2.64867C19.6411 2.8678 20.0413 3.12505 20.4605 3.54426C20.8797 3.96348 21.1417 4.36364 21.3561 4.92576C21.5181 5.34974 21.7182 5.98333 21.7706 7.15522C21.8277 8.42239 21.842 8.79873 21.842 12.0048C21.842 15.2108 21.8277 15.5871 21.7706 16.8543C21.7182 18.0262 21.5228 18.6598 21.3561 19.0838C21.137 19.6459 20.8797 20.046 20.4605 20.4653C20.0413 20.8845 19.6411 21.1465 19.079 21.3609C18.655 21.5228 18.0215 21.7229 16.8496 21.7753C15.5824 21.8325 15.206 21.8468 12 21.8468C8.79397 21.8468 8.41763 21.8325 7.15046 21.7753C5.97857 21.7229 5.34498 21.5276 4.921 21.3609C4.35888 21.1417 3.95872 20.8845 3.5395 20.4653C3.12029 20.046 2.85828 19.6459 2.64391 19.0838C2.48194 18.6598 2.28186 18.0262 2.22946 16.8543C2.17229 15.5871 2.158 15.2108 2.158 12.0048C2.158 8.79873 2.17229 8.42239 2.22946 7.15522C2.28186 5.98333 2.47718 5.34974 2.64391 4.92576C2.86304 4.36364 3.12029 3.96348 3.5395 3.54426C3.95872 3.12505 4.35888 2.86304 4.921 2.64867C5.34498 2.4867 5.97857 2.28662 7.15046 2.23422C8.41763 2.17229 8.79874 2.16276 12 2.16276Z"
                            fill="#FF8E49"
                          />
                          <path
                            d="M12 5.84033C8.59869 5.84033 5.83569 8.59857 5.83569 12.0047C5.83569 15.4108 8.59393 18.169 12 18.169C15.4062 18.169 18.1644 15.4108 18.1644 12.0047C18.1644 8.59857 15.4062 5.84033 12 5.84033ZM12 16.0015C9.78964 16.0015 7.99846 14.2103 7.99846 11.9999C7.99846 9.78952 9.78964 7.99833 12 7.99833C14.2104 7.99833 16.0016 9.78952 16.0016 11.9999C16.0016 14.2103 14.2104 16.0015 12 16.0015Z"
                            fill="#2B1D1E"
                          />
                          <path
                            d="M18.4073 7.03139C19.2018 7.03139 19.846 6.38727 19.846 5.59272C19.846 4.79817 19.2018 4.15405 18.4073 4.15405C17.6127 4.15405 16.9686 4.79817 16.9686 5.59272C16.9686 6.38727 17.6127 7.03139 18.4073 7.03139Z"
                            fill="#2B1D1E"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_20_573">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </a>
                    <a
                      :href="
                        this.$store.state.contactInfo
                          ? this.$store.state.contactInfo.linkedin
                          : '#'
                      "
                      class="mediaThumb"
                      target="_blank"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_20_575)">
                          <path
                            d="M22.2283 0H1.77167C1.30179 0 0.851161 0.186657 0.518909 0.518909C0.186657 0.851161 0 1.30179 0 1.77167V22.2283C0 22.6982 0.186657 23.1488 0.518909 23.4811C0.851161 23.8133 1.30179 24 1.77167 24H22.2283C22.6982 24 23.1488 23.8133 23.4811 23.4811C23.8133 23.1488 24 22.6982 24 22.2283V1.77167C24 1.30179 23.8133 0.851161 23.4811 0.518909C23.1488 0.186657 22.6982 0 22.2283 0ZM7.15333 20.445H3.545V8.98333H7.15333V20.445ZM5.34667 7.395C4.93736 7.3927 4.53792 7.2692 4.19873 7.04009C3.85955 6.81098 3.59584 6.48653 3.44088 6.10769C3.28591 5.72885 3.24665 5.31259 3.32803 4.91145C3.40941 4.51032 3.6078 4.14228 3.89816 3.85378C4.18851 3.56529 4.55782 3.36927 4.95947 3.29046C5.36112 3.21165 5.77711 3.25359 6.15495 3.41099C6.53279 3.56838 6.85554 3.83417 7.08247 4.17481C7.30939 4.51546 7.43032 4.91569 7.43 5.325C7.43386 5.59903 7.38251 5.87104 7.27901 6.1248C7.17551 6.37857 7.02198 6.6089 6.82757 6.80207C6.63316 6.99523 6.40185 7.14728 6.14742 7.24915C5.893 7.35102 5.62067 7.40062 5.34667 7.395ZM20.4533 20.455H16.8467V14.1933C16.8467 12.3467 16.0617 11.7767 15.0483 11.7767C13.9783 11.7767 12.9283 12.5833 12.9283 14.24V20.455H9.32V8.99167H12.79V10.58H12.8367C13.185 9.875 14.405 8.67 16.2667 8.67C18.28 8.67 20.455 9.865 20.455 13.365L20.4533 20.455Z"
                            fill="#FF8E49"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_20_575">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              <div class="containerBottomThumb">
                <div class="thumbHeader">
                  <div class="headerIcon">
                    <VsxIcon
                      iconName="UserTag"
                      :size="46"
                      color="#ff8e49"
                      type="bold"
                    />
                  </div>
                  <div class="headerTitle">Referrals</div>
                </div>
                <div class="thumbMain">
                  <div class="mainThumb">
                    <div class="thumbIcon">
                      <VsxIcon
                        iconName="User"
                        :size="40"
                        color="#ff8e49"
                        type="bold"
                      />
                    </div>
                    <div class="thumbContent">
                      <div class="contentValue">{{ referralsNum.referred_count || 0 }}</div>
                      <div class="contentTitle">Referred Users</div>
                    </div>
                  </div>
                  <div class="mainThumb">
                    <div class="thumbIcon">
                      <VsxIcon
                        iconName="TrendUp"
                        :size="40"
                        color="#ff8e49"
                        type="bold"
                      />
                    </div>
                    <div class="thumbContent">
                      <div class="contentValue">
                        {{ referralsNum.mining_boost || 0 }} <span class="valueUnit">MH/S</span>
                      </div>
                      <div class="contentTitle">Mining Boost</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="ranking" class="containerRanking">
            <div class="rankingTitleWrapper">
              <h2 class="rankingTitle">Connecting to Ranking Game Account</h2>
            </div>
            <div class="rankingContainer">
              <div class="containerBg">
                <img src="../assets/image/rankingBg.png" alt="" />
              </div>
              <div class="containerPic">
                <img src="../assets/image/rankingPic.png" alt="rankingPic" />
                <div class="picBackBg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="738"
                    height="738"
                    viewBox="0 0 738 738"
                    fill="none"
                  >
                    <g filter="url(#filter0_f_24_448)">
                      <circle
                        cx="369"
                        cy="369"
                        r="149"
                        fill="white"
                        fill-opacity="0.6"
                      />
                    </g>
                    <defs>
                      <filter
                        id="filter0_f_24_448"
                        x="0"
                        y="0"
                        width="738"
                        height="738"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                      >
                        <feFlood
                          flood-opacity="0"
                          result="BackgroundImageFix"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="BackgroundImageFix"
                          result="shape"
                        />
                        <feGaussianBlur
                          stdDeviation="110"
                          result="effect1_foregroundBlur_24_448"
                        />
                      </filter>
                    </defs>
                  </svg>
                </div>
              </div>
              <div class="containerContent">
                <div class="contentThumb">
                  <div class="thumbIcon">
                    <VsxIcon
                      iconName="StatusUp"
                      :size="40"
                      color="#070707"
                      type="bold"
                    />
                  </div>
                  <div class="thumbTitle">Level Promotion</div>
                </div>
                <div class="contentThumb">
                  <div class="thumbIcon">
                    <VsxIcon
                      iconName="Star"
                      :size="40"
                      color="#070707"
                      type="bold"
                    />
                  </div>
                  <div class="thumbTitle">Rewards For Gaming Activities</div>
                </div>
                <div class="contentThumb">
                  <div class="thumbIcon">
                    <VsxIcon
                      iconName="FavoriteChart"
                      :size="40"
                      color="#070707"
                      type="bold"
                    />
                  </div>
                  <div class="thumbTitle">Exclusive Plans Accessibility</div>
                </div>
              </div>
            </div>
            <div class="rankingBtnWrapper">
              <div class="rankingBtn">Connect Now</div>
            </div>
          </div>
        </div>
      </main>
      <miningDialog
        :show="showDialog"
        :plan="selectedPlan"
        @closeDialog="handleDialogClose"
      />
    </div>
  </div>
</template>

<script>
import miningDialog from "../components/miningDialog.vue";
import { get } from "../helpers/http";
import axios from "axios";

// Constants for slider configuration
const SLIDER_CONSTANTS = {
  // Breakpoints
  BREAKPOINTS: {
    MOBILE: 480,
    TABLET: 768,
    LAPTOP: 1024,
    DESKTOP: 1440,
  },
  // Slide widths (card width + padding)
  SLIDE_WIDTHS: {
    MOBILE: 282,    // 250px + 32px padding
    TABLET_SMALL: 282, // Same as mobile for small tablets
    TABLET: 298,    // 266px + 32px padding
    LAPTOP: 320,    // 280px + 40px padding
    DESKTOP: 348,   // 300px + 48px padding
    LARGE: 348,     // Keep same for larger screens
  },
  // Performance settings
  PERFORMANCE: {
    THROTTLE_DELAY: 16, // ~60fps
    NAVIGATION_DELAY: 300, // Prevent rapid clicks
    DRAG_MULTIPLIER: 1.5,
  },
  // Animation settings
  ANIMATION: {
    TRANSITION_DURATION: '0.3s',
    CUBIC_BEZIER: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  }
};

export default {
  name: "HomePage",
  components: {
    miningDialog,
  },
  data() {
    return {
      // Dialog and selection state
      showDialog: false,
      selectedPlan: "",
      selectedPlanIndex: -1,

      // Animation state
      animateExit: false,
      animateReturn: false,

      // Data from API
      plansList: [],
      stakesList: [],
      referralCode: { referral_code: '' },
      referralsNum: [],

      // Slider state
      currentSlide: 0,
      slidesToShow: 3,
      slideWidth: SLIDER_CONSTANTS.SLIDE_WIDTHS.DESKTOP,

      // Drag interaction properties
      isDragging: false,
      startX: 0,
      startPosition: 0,

      // Performance optimization properties
      animationFrameId: null,
      lastMoveTime: 0,

      // Edge case handling
      isNavigating: false,
    };
  },

  computed: {
    sliderStyle() {
      return {
        '--total-slides': this.plansList.length,
        '--slides-to-show': this.slidesToShow,
      };
    },

    sliderClasses() {
      return {
        'no-navigation': !this.plansList || this.plansList.length <= this.slidesToShow,
        'no-dots': !this.plansList || this.plansList.length <= this.slidesToShow,
        'empty-slider': !this.plansList || this.plansList.length === 0,
      };
    },

    totalDotGroups() {
      if (!this.plansList || this.plansList.length === 0) return 0;
      const groups = Math.ceil(this.plansList.length / this.slidesToShow);
      // Limit to maximum 7 dots to prevent clutter
      return Math.min(groups, 7);
    },

    planClasses() {
      return (index) => ({
        'selected-plan': (this.animateExit || this.animateReturn) && index === this.selectedPlanIndex,
        'exit-left': this.animateExit && index < this.selectedPlanIndex,
        'exit-right': this.animateExit && index > this.selectedPlanIndex,
        'return-left': this.animateReturn && index < this.selectedPlanIndex,
        'return-right': this.animateReturn && index > this.selectedPlanIndex
      });
    },


  },
  created() {
    this.fetchplansListHandler();
    this.fetchstakesListHandler();
    this.loadReferralData();
    this.loadWalletInfo();

    // Listen for refresh user data events
    this.$root.$on = this.$root.$on || {};
    this.$root.$on["refresh-user-data"] = () => {
      this.loadReferralData();
      this.loadWalletInfo();
    };
  },

  mounted() {
    this.updateSlidesToShow();
    window.addEventListener('resize', this.updateSlidesToShow);

    // Handle orientation changes on mobile devices
    window.addEventListener('orientationchange', () => {
      // Delay to allow viewport to update
      setTimeout(() => {
        this.updateSlidesToShow();
      }, 100);
    });

    // Handle visibility changes (tab switching, etc.)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.updateSlidesToShow();
      }
    });
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.updateSlidesToShow);
    window.removeEventListener('orientationchange', this.updateSlidesToShow);
    document.removeEventListener('visibilitychange', this.updateSlidesToShow);

    // Cleanup animation frame to prevent memory leaks
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  },
  watch: {
    '$store.state.auth.loggedIn': {
      handler(newValue) {
        if (newValue === true) {
          this.loadReferralData();
          this.loadWalletInfo();
        } else {
          this.referralCode = { referral_code: 'Login Required' };
          this.referralsNum = [];
        }
      },
      immediate: true
    },
    '$store.state.wallet.connected': {
      handler(newValue) {
        console.log('Wallet connection state changed:', newValue);
        if (newValue) {
          // Update localStorage when wallet is connected
          localStorage.setItem('walletConnected', 'true');
        } else {
          // Clear localStorage when wallet is disconnected
          localStorage.removeItem('walletConnected');
        }
      },
      immediate: true
    }
  },
  methods: {
    // ============ PERFORMANCE OPTIMIZATION UTILITIES ============

    /**
     * Throttles function calls to improve performance
     * @param {Function} func - Function to throttle
     * @param {number} delay - Delay in milliseconds
     */
    throttle(func, delay = SLIDER_CONSTANTS.PERFORMANCE.THROTTLE_DELAY) {
      return (...args) => {
        const now = Date.now();
        if (now - this.lastMoveTime >= delay) {
          this.lastMoveTime = now;
          func.apply(this, args);
        }
      };
    },

    /**
     * Manages requestAnimationFrame for smooth animations
     * @param {Function} callback - Animation callback function
     */
    requestAnimationFrame(callback) {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
      this.animationFrameId = requestAnimationFrame(callback);
    },

    loadReferralData() {
      if (this.$store.state.auth.loggedIn) {
        this.fetchreferralCodeHandler();
        this.fetchreferralsNumHandler();
      }
    },
    
    async loadWalletInfo() {
      if (this.$store.state.auth.loggedIn) {
        try {
          const response = await get("/wallets/wallet/connected-info/");
          if (response) {
            this.$store.dispatch('setWalletInfo', response);
            console.log('Wallet info loaded and stored:', response);
          }
        } catch (error) {
          console.error("Error fetching wallet info:", error);
          // Clear wallet info if there's an error
          this.$store.dispatch('clearWalletInfo');
        }
      }
    },
    async showDialogHandler(plan, index) {
      console.log('🎯 Starting animation for plan:', plan.name, 'at index:', index);
      // Set selected plan and index for animation FIRST
      this.selectedPlan = plan;
      this.selectedPlanIndex = index;

      // Force Vue update to apply classes and start animation
      this.$nextTick(() => {
        console.log('🚀 Animation started - animateExit:', true);
        this.animateExit = true;

        // First check if user is logged in
        const isLoggedIn = this.$store.state.auth.loggedIn;

        if (!isLoggedIn) {
          // User is not logged in, show login message
          setTimeout(() => {
            this.$swal({
              title: 'Login Required',
              text: 'Please login to your account before starting mining.',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Go to Login',
              cancelButtonText: 'Cancel'
            }).then((result) => {
              if (result.isConfirmed) {
                // Open login modal
                if (this.$root.$on && this.$root.$on["login-modal"]) {
                  this.$root.$on["login-modal"](true);
                }
              }
              // Start return animation after Swal closes
              setTimeout(() => {
                console.log('🔄 Starting return animation - login required');
                this.animateExit = false;
                this.animateReturn = true;

                // Reset animation state after return animation completes
                setTimeout(() => {
                  console.log('✅ Animation fully reset - login required');
                  this.animateReturn = false;
                  this.selectedPlanIndex = -1;
                }, 1200);
              }, 200);
            });
          }, 800);
          return; // Exit the function if not logged in
        }

        // Check if wallet is connected using the store or localStorage
        const walletConnected = this.$store.state.wallet?.connected || localStorage.getItem('walletConnected') === 'true';

        if (!walletConnected) {
          // Wallet is not connected, show message but still run animation
          setTimeout(() => {
            this.$swal({
              title: 'Wallet Not Connected',
              text: 'Please connect your wallet before starting mining. You can connect your wallet in the Wallet Details page.',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Connect Wallet',
              cancelButtonText: 'Cancel'
            }).then((result) => {
              if (result.isConfirmed) {
                // Navigate to wallet details page
                this.$router.push('/wallet');
              }
              // Start return animation after Swal closes
              setTimeout(() => {
                console.log('🔄 Starting return animation - Swal closed');
                this.animateExit = false;
                this.animateReturn = true;

                // Reset animation state after return animation completes
                setTimeout(() => {
                  console.log('✅ Animation fully reset - Swal closed');
                  this.animateReturn = false;
                  this.selectedPlanIndex = -1;
                }, 1200);
              }, 200);
            });


          }, 800);
        } else {
          // Wallet is connected, show dialog after animation
          setTimeout(() => {
            console.log('💎 Opening mining dialog');
            this.showDialog = !this.showDialog;
            // Dialog will handle its own return animation when closed
          }, 1200);
        }
      });
    },

    handleDialogClose() {
      console.log('📱 Dialog closed - starting return animation');
      // Start return animation when dialog closes
      this.animateExit = false;
      this.animateReturn = true;

      // Reset animation state after return animation completes
      setTimeout(() => {
        console.log('✅ Animation fully reset - dialog closed');
        this.animateReturn = false;
        this.selectedPlanIndex = -1;
        this.showDialog = false;
      }, 1200);
    },

    async fetchplansListHandler() {
      this.plansList = [];
      try {
        const response = await get("/plans/plans/");
        if (response) {
          this.plansList = this.plansList.concat(response);
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    },
    async fetchstakesListHandler() {
      try {
        const response = await get("/stakes/stake/summary/");
        if (response) {
          this.stakesList = response;
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    },
    
    async fetchreferralCodeHandler() {
      try {
        const response = await get("/users/me/referral-code/");
        if (response) {
          this.referralCode = response;
        }
      } catch (error) {
        console.error("Error fetching referral code:", error);
        this.referralCode = { referral_code: 'Login Required' };
      }
    },
    
    copyInviteLink() {
      if (this.referralCode && this.referralCode.referral_code && this.referralCode.referral_code !== 'Login Required') {
        const baseUrl = window.location.origin;
        const inviteLink = `${this.referralCode.referral_code}`;
        navigator.clipboard.writeText(inviteLink)
          .then(() => {
            this.$notify({
              title: 'Success',
              text: 'Invitation link copied to clipboard!',
              type: 'success'
            });
          })
          .catch(err => {
            console.error('Failed to copy: ', err);
          });
      } else {
        this.$notify({
          title: 'Error',
          text: 'Please login to get your referral code',
          type: 'error'
        });
      }
    },

    async fetchreferralsNumHandler() {
      try {
        const response = await get("/users/me/referrals/");
        if (response) {
          this.referralsNum = response;
        }
      } catch (error) {
        console.error("Error fetching referrals:", error);
        this.referralsNum = [];
      }
    },
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    },
    
    handleStartMiningClick() {
      // First check if user is logged in
      const isLoggedIn = this.$store.state.auth.loggedIn;
      
      if (!isLoggedIn) {
        this.$swal({
          title: 'Login Required',
          text: 'Please login to your account before starting mining.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Go to Login',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            // Open login modal
            if (this.$root.$on && this.$root.$on["login-modal"]) {
              this.$root.$on["login-modal"](true);
            }
          }
        });
        return;
      }
      
      // Check if wallet is connected
      const walletConnected = this.$store.state.wallet?.connected || localStorage.getItem('walletConnected') === 'true';
      
      if (!walletConnected) {
        this.$swal({
          title: 'Wallet Not Connected',
          text: 'Please connect your wallet before starting mining. You can connect your wallet in the Wallet Details page.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Connect Wallet',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            // Navigate to wallet details page
            this.$router.push('/wallet');
          }
        });
        return;
      }
      
      // If both login and wallet are connected, scroll to plans section
      this.scrollToSection('plans');
    },

    // ============ NAVIGATION METHODS ============

    /**
     * Navigate to the next slide
     */
    nextSlide() {
      // Prevent rapid clicks and handle edge cases
      if (this.isNavigating || !this.plansList || this.plansList.length === 0) return;

      if (this.slidesToShow >= this.plansList.length) return; // No need to slide if all items fit

      const maxSlide = Math.max(0, this.plansList.length - this.slidesToShow);
      if (this.currentSlide >= maxSlide) return;

      this.isNavigating = true;
      this.currentSlide = Math.min(this.currentSlide + 1, maxSlide);

      // Reset navigation flag after delay
      setTimeout(() => {
        this.isNavigating = false;
      }, SLIDER_CONSTANTS.PERFORMANCE.NAVIGATION_DELAY);
    },

    /**
     * Navigate to the previous slide
     */
    prevSlide() {
      // Prevent rapid clicks and handle edge cases
      if (this.isNavigating || !this.plansList || this.plansList.length === 0) return;

      if (this.slidesToShow >= this.plansList.length || this.currentSlide <= 0) return;

      this.isNavigating = true;
      this.currentSlide = Math.max(this.currentSlide - 1, 0);

      // Reset navigation flag after delay
      setTimeout(() => {
        this.isNavigating = false;
      }, SLIDER_CONSTANTS.PERFORMANCE.NAVIGATION_DELAY);
    },

    /**
     * Updates the number of slides to show and slide width based on screen size
     */
    updateSlidesToShow() {
      const width = window.innerWidth;

      if (width <= SLIDER_CONSTANTS.BREAKPOINTS.MOBILE) {
        this.slidesToShow = 1;
        this.slideWidth = SLIDER_CONSTANTS.SLIDE_WIDTHS.MOBILE;
      } else if (width <= SLIDER_CONSTANTS.BREAKPOINTS.TABLET) {
        this.slidesToShow = 1;
        this.slideWidth = SLIDER_CONSTANTS.SLIDE_WIDTHS.TABLET;
      } else if (width <= SLIDER_CONSTANTS.BREAKPOINTS.LAPTOP) {
        this.slidesToShow = 2;
        this.slideWidth = SLIDER_CONSTANTS.SLIDE_WIDTHS.LAPTOP;
      } else if (width <= SLIDER_CONSTANTS.BREAKPOINTS.DESKTOP) {
        this.slidesToShow = 3;
        this.slideWidth = SLIDER_CONSTANTS.SLIDE_WIDTHS.DESKTOP;
      } else {
        this.slidesToShow = 4;
        this.slideWidth = SLIDER_CONSTANTS.SLIDE_WIDTHS.LARGE;
      }

      // Ensure current slide is within bounds after resize
      this.ensureSlideBounds();

      // Force update for CSS variables
      this.$forceUpdate();
    },

    /**
     * Ensures the current slide index is within valid bounds
     */
    ensureSlideBounds() {
      if (this.plansList.length > 0) {
        const maxSlide = Math.max(0, this.plansList.length - this.slidesToShow);
        if (this.currentSlide > maxSlide) {
          this.currentSlide = maxSlide;
        }
      } else {
        this.currentSlide = 0;
      }
    },

    // ============ MOUSE DRAG INTERACTION METHODS ============

    /**
     * Handles mouse down event to start dragging
     */
    handleMouseDown(e) {
      this.isDragging = true;
      const sliderTrack = this.$refs.sliderTrack;
      this.startX = e.clientX;
      this.startPosition = this.currentSlide * this.slideWidth;

      // Update cursor and disable text selection
      sliderTrack.style.cursor = 'grabbing';
      sliderTrack.style.userSelect = 'none';
      sliderTrack.style.transition = 'none'; // Disable transition during drag
    },

    /**
     * Handles mouse move event during dragging
     */
    handleMouseMove(e) {
      if (!this.isDragging) return;
      e.preventDefault();

      // Use throttling to improve performance
      this.throttledMouseMove(e);
    },

    /**
     * Throttled mouse move handler for smooth dragging
     */
    throttledMouseMove(e) {
      const sliderTrack = this.$refs.sliderTrack;
      const deltaX = this.startX - e.clientX;
      const walk = deltaX * SLIDER_CONSTANTS.PERFORMANCE.DRAG_MULTIPLIER;
      const newPosition = this.startPosition + walk;

      // Calculate max scroll distance with bounds checking
      const maxScroll = this.calculateMaxScroll();
      const clampedPosition = Math.max(0, Math.min(maxScroll, newPosition));

      // Use requestAnimationFrame for smooth animation
      this.requestAnimationFrame(() => {
        sliderTrack.style.transform = `translateX(-${clampedPosition}px)`;
      });
    },

    /**
     * Handles mouse up event to end dragging and snap to slide
     */
    handleMouseUp() {
      if (!this.isDragging) return;
      const sliderTrack = this.$refs.sliderTrack;

      // Reset drag state
      this.isDragging = false;
      sliderTrack.style.cursor = 'grab';
      sliderTrack.style.userSelect = '';
      sliderTrack.style.transition = `transform ${SLIDER_CONSTANTS.ANIMATION.TRANSITION_DURATION} ease`;

      // Snap to nearest slide
      this.snapToNearestSlide();
    },

    /**
     * Handles mouse leave event to end dragging
     */
    handleMouseLeave() {
      if (this.isDragging) {
        this.handleMouseUp();
      }
    },

    /**
     * Calculates the maximum scroll distance
     */
    calculateMaxScroll() {
      if (!this.plansList || this.plansList.length === 0) return 0;
      return (this.plansList.length - this.slidesToShow) * this.slideWidth;
    },

    /**
     * Snaps the slider to the nearest valid slide position
     */
    snapToNearestSlide() {
      const sliderTrack = this.$refs.sliderTrack;
      const currentPosition = parseFloat(
        sliderTrack.style.transform.replace('translateX(-', '').replace('px)', '')
      ) || 0;

      const nearestSlide = Math.round(currentPosition / this.slideWidth);

      // Handle edge cases
      if (!this.plansList || this.plansList.length === 0) {
        this.currentSlide = 0;
      } else if (this.slidesToShow >= this.plansList.length) {
        this.currentSlide = 0; // No sliding needed
      } else {
        const maxSlide = Math.max(0, this.plansList.length - this.slidesToShow);
        this.currentSlide = Math.max(0, Math.min(nearestSlide, maxSlide));
      }

      sliderTrack.style.transform = `translateX(-${this.currentSlide * this.slideWidth}px)`;
    },

    // ============ TOUCH INTERACTION METHODS ============

    /**
     * Handles touch start event to begin touch dragging
     */
    handleTouchStart(e) {
      this.isDragging = true;
      const sliderTrack = this.$refs.sliderTrack;
      const touch = e.touches[0];

      this.startX = touch.clientX;
      this.startPosition = this.currentSlide * this.slideWidth;

      // Update styles for touch interaction
      sliderTrack.style.cursor = 'grabbing';
      sliderTrack.style.userSelect = 'none';
      sliderTrack.style.transition = 'none';
    },

    /**
     * Handles touch move event during touch dragging
     */
    handleTouchMove(e) {
      if (!this.isDragging) return;
      e.preventDefault();

      // Use throttling to improve performance
      this.throttledTouchMove(e);
    },

    /**
     * Throttled touch move handler for smooth touch dragging
     */
    throttledTouchMove(e) {
      const sliderTrack = this.$refs.sliderTrack;
      const touch = e.touches[0];
      const deltaX = this.startX - touch.clientX;
      const walk = deltaX * SLIDER_CONSTANTS.PERFORMANCE.DRAG_MULTIPLIER;
      const newPosition = this.startPosition + walk;

      // Calculate max scroll distance with bounds checking
      const maxScroll = this.calculateMaxScroll();
      const clampedPosition = Math.max(0, Math.min(maxScroll, newPosition));

      // Use requestAnimationFrame for smooth animation
      this.requestAnimationFrame(() => {
        sliderTrack.style.transform = `translateX(-${clampedPosition}px)`;
      });
    },

    /**
     * Handles touch end event to finish touch interaction
     */
    handleTouchEnd() {
      if (!this.isDragging) return;
      const sliderTrack = this.$refs.sliderTrack;

      // Reset touch interaction state
      this.isDragging = false;
      sliderTrack.style.cursor = 'grab';
      sliderTrack.style.userSelect = '';
      sliderTrack.style.transition = `transform ${SLIDER_CONSTANTS.ANIMATION.TRANSITION_DURATION} ease`;

      // Snap to nearest slide
      this.snapToNearestSlide();
    },

    // ============ KEYBOARD ACCESSIBILITY METHODS ============

    /**
     * Handles keyboard navigation for accessibility
     */
    handleKeyDown(e) {
      // Handle edge cases for empty or small lists
      if (!this.plansList || this.plansList.length === 0) return;
      if (this.slidesToShow >= this.plansList.length) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.prevSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.nextSlide();
          break;
        case 'Home':
          e.preventDefault();
          this.currentSlide = 0;
          break;
        case 'End':
          e.preventDefault();
          this.currentSlide = Math.max(0, this.plansList.length - this.slidesToShow);
          break;
      }
    },

    getCurrencySymbol(plan) {
      if (plan && plan.token_details && plan.token_details.length > 0) {
        const symbol = plan.token_details[0].symbol;
        // Normalize symbols to lowercase
        const symbolMap = {
          'RZ': 'rz',
          'MGC': 'mgc'
        };
        return symbolMap[symbol] || symbol.toLowerCase();
      }
      return 'rz'; // Default fallback
    },

    // ============ END OF SLIDER METHODS ============
  },
};
</script>

<style scoped>
.plansThumb {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.plan-image {
  width: 100%;
  height: auto;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 3;
}

.plansThumb:hover .hover-overlay {
  opacity: 1;
  visibility: visible;
}

.plansThumb:hover .plan-image {
  opacity: 0;
}

.hover-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-mine {
  width: 100%;
  height: 100%;
  animation: spin 20s linear infinite;
}

.hover-gif {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 4;
  pointer-events: none;
}

.mine-hover-gif {
  width: 80%;
  height: auto;
  max-width: 200px;
  border-radius: 10px;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Test hover effect - temporary debug style */
.plansThumb:hover {
  border: 2px solid #5cf2a3;
  box-shadow: 0 0 20px rgba(92, 242, 163, 0.5);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .mine-hover-gif {
    width: 60%;
    max-width: 150px;
  }

  .back-mine {
    animation-duration: 4s;
  }
}

.thumbPic{
  min-height: 200px;
}

/* Internal spacing for plan cards */
.thumbContent {
  color: #fff;
  padding: 20px;
}

.contentHeader {
  font-family: "RubikB", sans-serif;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px !important;
  color: #fff;
}

.contentMain {
  margin-bottom: 24px !important;

  .mainDesc {
    font-family: "Rubik", sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.4;
    color: #e0e0e0;
    margin-bottom: 8px !important;

    &:first-child {
      margin-bottom: 8px !important;
    }

    &:last-child {
      margin-bottom: 0 !important;
    }
  }
}

.contentFooter {
  margin-top: 16px;

  .miningBtn {
    font-family: "Rubik", sans-serif;
    width: 100%;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    border: 2px solid #5cf2a3;
    font-size: 16px;
    font-weight: 500;
    color: #5cf2a3;
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;

    &:hover {
      background: #5cf2a3;
      color: #070707;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(92, 242, 163, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

/* Custom Slider Styles */
.custom-slider {
  position: relative;
  width: 100%;
  padding: 0 60px 0 0;
}

.slider-track {
  display: flex;
  transition: transform 0.3s ease;
  width: calc(348px * var(--total-slides));
  margin-left: 0;
}

.slider-slide {
  flex: 0 0 300px;
  padding: 0 24px;
  box-sizing: border-box;
  will-change: transform, opacity;
  backface-visibility: hidden;
  min-width: 300px;
}

/* Navigation buttons */
.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.slider-nav:hover {
  background: #5cf2a3;
  transform: translateY(-50%) scale(1.1);
}

.slider-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: translateY(-50%);
}

.slider-nav:disabled:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-50%);
}

.slider-prev {
  left: 10px;
}

.slider-next {
  right: 10px;
}

.slider-nav svg {
  width: 24px;
  height: 24px;
  color: #333;
}

.slider-nav:hover svg {
  color: white;
}

/* Dots indicator */
.slider-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.slider-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.slider-dot:hover {
  background: rgba(255, 255, 255, 0.8);
}

.slider-dot.active {
  background: #5cf2a3;
  transform: scale(1.2);
}

/* Animation classes for mining plan selection */
.plansThumb {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  will-change: transform, opacity;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

.slider-slide.selected-plan {
  transform: scale3d(1.05, 1.05, 1) !important;
  z-index: 9999 !important;
  position: relative !important;
  transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
  box-shadow: 0 20px 40px rgba(92, 242, 163, 0.3) !important;
  animation: none !important;
}

.slider-slide.exit-left {
  animation: exitLeft 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards !important;
  transform-origin: center center !important;
  z-index: 1 !important;
}

.slider-slide.exit-right {
  animation: exitRight 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards !important;
  transform-origin: center center !important;
  z-index: 1 !important;
}

.slider-slide.return-left {
  animation: returnLeft 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards !important;
  transform-origin: center center !important;
  z-index: 1 !important;
}

.slider-slide.return-right {
  animation: returnRight 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards !important;
  transform-origin: center center !important;
  z-index: 1 !important;
}

@keyframes exitLeft {
  0% {
    transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
    opacity: 1;
    visibility: visible;
  }
  50% {
    transform: translate3d(-50vw, 0, 0) scale3d(0.9, 0.9, 1);
    opacity: 0.7;
  }
  100% {
    transform: translate3d(-150vw, 0, 0) scale3d(0.6, 0.6, 1);
    opacity: 0;
    visibility: hidden;
  }
}

@keyframes exitRight {
  0% {
    transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
    opacity: 1;
    visibility: visible;
  }
  50% {
    transform: translate3d(50vw, 0, 0) scale3d(0.9, 0.9, 1);
    opacity: 0.7;
  }
  100% {
    transform: translate3d(150vw, 0, 0) scale3d(0.6, 0.6, 1);
    opacity: 0;
    visibility: hidden;
  }
}

@keyframes returnLeft {
  0% {
    transform: translate3d(-150vw, 0, 0) scale3d(0.6, 0.6, 1);
    opacity: 0;
    visibility: hidden;
  }
  50% {
    transform: translate3d(-50vw, 0, 0) scale3d(0.9, 0.9, 1);
    opacity: 0.7;
  }
  100% {
    transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
    opacity: 1;
    visibility: visible;
  }
}

@keyframes returnRight {
  0% {
    transform: translate3d(150vw, 0, 0) scale3d(0.6, 0.6, 1);
    opacity: 0;
    visibility: hidden;
  }
  50% {
    transform: translate3d(50vw, 0, 0) scale3d(0.9, 0.9, 1);
    opacity: 0.7;
  }
  100% {
    transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
    opacity: 1;
    visibility: visible;
  }
}

/* Responsive adjustments */
@media (max-width: 1440px) {
  .custom-slider {
    padding: 0 60px 0 0;
  }

  .slider-track {
    width: calc(348px * var(--total-slides));
  }

  .slider-slide {
    flex: 0 0 300px;
    min-width: 300px;
    padding: 0 24px;
  }
}

@media (max-width: 1024px) {
  .custom-slider {
    padding: 0 55px 0 0;
  }

  .slider-slide {
    flex: 0 0 280px;
    min-width: 280px;
    padding: 0 20px;
  }

  .slider-track {
    width: calc(320px * var(--total-slides));
  }

  .slider-nav {
    width: 45px;
    height: 45px;
  }

  .slider-prev {
    left: 5px;
  }

  .slider-next {
    right: 5px;
  }

  /* Tablet internal spacing */
  .contentHeader {
    font-size: 22px;
    margin-bottom: 14px !important;
  }

  .contentMain {
    margin-bottom: 22px !important;

    .mainDesc {
      font-size: 15px;
      margin-bottom: 7px !important;

      &:first-child {
        margin-bottom: 7px !important;
      }
    }
  }

  .contentFooter {
    margin-top: 14px;

    .miningBtn {
      height: 42px;
      font-size: 15px;
    }
  }
}

@media (max-width: 768px) and (min-width: 481px) {
  .custom-slider {
    padding: 0 52px 0 0;
  }

  .slider-slide {
    flex: 0 0 266px;
    min-width: 266px;
    padding: 0 16px;
  }

  .slider-track {
    width: calc(298px * var(--total-slides));
  }
}

@media (max-width: 480px) {
  .custom-slider {
    padding: 0 50px 0 0;
  }

  .slider-slide {
    flex: 0 0 250px;
    min-width: 250px;
    padding: 0 16px;
  }

  .slider-track {
    width: calc(282px * var(--total-slides));
  }

  .slider-nav {
    width: 40px;
    height: 40px;
  }

  .slider-prev {
    left: 5px;
  }

  .slider-next {
    right: 5px;
  }

  /* Mobile internal spacing */
  .thumbContent {
    padding: 16px;
  }

  .contentHeader {
    font-size: 20px;
    margin-bottom: 12px !important;
  }

  .contentMain {
    margin-bottom: 20px !important;

    .mainDesc {
      font-size: 14px;
      margin-bottom: 6px !important;

      &:first-child {
        margin-bottom: 6px !important;
      }
    }
  }

  .contentFooter {
    margin-top: 12px;

    .miningBtn {
      height: 40px;
      font-size: 14px;
    }
  }
}

.containerPlansList{
  width: 95% !important;
  overflow: hidden ;
  margin: 0 auto;
}

.plansThumb{
  margin-right: 20px;
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Focus management for accessibility */
.custom-slider:focus-visible {
  outline: 2px solid #5cf2a3;
  outline-offset: 2px;
}

.slider-nav:focus-visible,
.slider-dot:focus-visible {
  outline: 2px solid #5cf2a3;
  outline-offset: 2px;
}

/* Edge case handling - hide navigation when not needed */
.custom-slider.no-navigation .slider-nav,
.custom-slider.no-dots .slider-dots {
  display: none;
}

/* Hide dots on mobile and small tablets to prevent clutter */
@media (max-width: 1023px) {
  .slider-dots {
    display: none !important;
  }
}

/* Show dots only on larger screens with proper spacing */
@media (min-width: 1024px) {
  .slider-dots {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 25px;
  }

  .slider-dot {
    width: 14px;
    height: 14px;
    background: rgba(255, 255, 255, 0.4);
    transition: all 0.3s ease;
  }

  .slider-dot:hover {
    background: rgba(255, 255, 255, 0.7);
    transform: scale(1.1);
  }

  .slider-dot.active {
    background: #5cf2a3;
    transform: scale(1.3);
    box-shadow: 0 0 8px rgba(92, 242, 163, 0.5);
  }
}

/* Handle empty state */
.custom-slider.empty-slider .slider-track {
  justify-content: center;
}

.custom-slider.empty-slider::after {
  content: "No mining plans available";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #666;
  font-size: 18px;
  text-align: center;
}
</style>
