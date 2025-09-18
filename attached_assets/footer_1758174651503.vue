<template>
  <div class="footer">
    <div class="footerContainer">
      <div class="containerRow">
        <div class="rowGroup">
          <div class="mainColumn">
            <div class="columnLogo">
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
            <div class="columnMaidnDesc">
              {{
                $store.state.contactInfo
                  ? $store.state.contactInfo.about_us
                  : ""
              }}
            </div>
          </div>
          <div class="linkColumn">
            <h4 class="columnTitle">Quick Link</h4>
            <div class="columnLinks">
              <div class="linkThumb" @click="navigateTo('/')">Home</div>
              <div class="linkThumb" @click="navigateTo('/')">About Us</div>
              <div class="linkThumb" @click="navigateTo('/vip-plan')">VIP Plans</div>
              <div class="linkThumb" @click="navigateTo('/contact-us')">Support</div>
              <div class="linkThumb" @click="navigateTo('/contact-us')">Contact</div>
            </div>
          </div>
          <div class="linkColumn">
            <h4 class="columnTitle">Resources</h4>
            <div class="columnLinks">
              <div class="linkThumb" @click="openExternalLink('#')">Whitepaper</div>
              <div class="linkThumb" @click="openExternalLink('#')">Contracts</div>
              <div class="linkThumb" @click="navigateTo('/contact-us')">Contact Us</div>
            </div>
          </div>
        </div>
        <div class="rowGroup">
          <div class="coinColumn">
            <h4 class="columnTitle">Mine the Future of Gamming-Powered Crypto</h4>
            <div class="columnMain">
              <div class="mainThumb">
                <img src="../assets/image/visaCoin.png" alt="visaCoin" />
              </div>
              <div class="mainThumb">
                <img
                  src="../assets/image/masterCardCoin.png"
                  alt="masterCardCoin"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="containerRow">
        <div class="rowGroup">
          <div class="ruleColumn">
            <div class="ruleContent">©2021 RANKING. All rights reserved</div>
          </div>
        </div>
        <div class="rowGroup">
          <div class="mediaColumn">
            <div class="mediaLinksList">
              <a 
                :href="this.$store.state.contactInfo && this.$store.state.contactInfo.facebook ? this.$store.state.contactInfo.facebook : '#'" 
                class="mediaThumb"
                target="_blank"
              >
                <svg
                  width="12"
                  height="21"
                  viewBox="0 0 12 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.30586 3.40011H11.2731V0.220108C10.3206 0.125455 9.36358 0.0787238 8.40593 0.080108C5.55965 0.080108 3.61329 1.74011 3.61329 4.78011V7.40011H0.400757V10.9601H3.61329V20.0801H7.46415V10.9601H10.6662L11.1476 7.40011H7.46415V5.13011C7.46415 4.08011 7.75715 3.40011 9.30586 3.40011Z"
                    fill="#40B66B"
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
                  width="22"
                  height="21"
                  viewBox="0 0 22 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.2291 3.54008C15.9807 3.54008 15.738 3.61046 15.5315 3.74231C15.325 3.87417 15.164 4.06159 15.069 4.28086C14.9739 4.50013 14.9491 4.74141 14.9975 4.97419C15.046 5.20696 15.1656 5.42078 15.3412 5.58861C15.5168 5.75643 15.7405 5.87072 15.9841 5.91702C16.2277 5.96332 16.4802 5.93956 16.7096 5.84873C16.9391 5.75791 17.1352 5.6041 17.2732 5.40676C17.4112 5.20942 17.4848 4.97742 17.4848 4.74008C17.4848 4.42182 17.3525 4.11659 17.117 3.89155C16.8815 3.66651 16.5621 3.54008 16.2291 3.54008ZM21.0427 5.96008C21.0223 5.13038 20.8597 4.30948 20.5613 3.53008C20.2952 2.86321 19.8811 2.25936 19.3474 1.76008C18.8293 1.2475 18.1959 0.854255 17.4953 0.610078C16.6818 0.316239 15.8219 0.157288 14.9525 0.140078C13.8432 0.0800781 13.4874 0.0800781 10.6412 0.0800781C7.79488 0.0800781 7.43909 0.0800781 6.32988 0.140078C5.46046 0.157288 4.60049 0.316239 3.78706 0.610078C3.08771 0.856727 2.45489 1.24964 1.93488 1.76008C1.39851 2.25526 0.987 2.86052 0.731487 3.53008C0.424005 4.30742 0.257675 5.12923 0.239666 5.96008C0.17688 7.02008 0.17688 7.36008 0.17688 10.0801C0.17688 12.8001 0.17688 13.1401 0.239666 14.2001C0.257675 15.0309 0.424005 15.8527 0.731487 16.6301C0.987 17.2996 1.39851 17.9049 1.93488 18.4001C2.45489 18.9105 3.08771 19.3034 3.78706 19.5501C4.60049 19.8439 5.46046 20.0029 6.32988 20.0201C7.43909 20.0801 7.79488 20.0801 10.6412 20.0801C13.4874 20.0801 13.8432 20.0801 14.9525 20.0201C15.8219 20.0029 16.6818 19.8439 17.4953 19.5501C18.1959 19.3059 18.8293 18.9127 19.3474 18.4001C19.8835 17.9027 20.298 17.2983 20.5613 16.6301C20.8597 15.8507 21.0223 15.0298 21.0427 14.2001C21.0427 13.1401 21.1054 12.8001 21.1054 10.0801C21.1054 7.36008 21.1054 7.02008 21.0427 5.96008ZM19.1591 14.0801C19.1515 14.7148 19.0312 15.3438 18.8033 15.9401C18.6362 16.3753 18.3679 16.7685 18.0185 17.0901C17.6791 17.4206 17.2684 17.6765 16.8151 17.8401C16.1911 18.0578 15.533 18.1728 14.8687 18.1801C13.8223 18.2301 13.4351 18.2401 10.683 18.2401C7.93091 18.2401 7.54374 18.2401 6.49731 18.1801C5.8076 18.1924 5.12083 18.0909 4.46724 17.8801C4.03379 17.7082 3.64198 17.4529 3.31617 17.1301C2.96884 16.8088 2.70384 16.4153 2.54181 15.9801C2.28633 15.3752 2.14463 14.732 2.12324 14.0801C2.12324 13.0801 2.06045 12.7101 2.06045 10.0801C2.06045 7.45008 2.06045 7.08008 2.12324 6.08008C2.12793 5.43113 2.2519 4.78802 2.48949 4.18008C2.67371 3.75799 2.95647 3.38174 3.31617 3.08008C3.63408 2.73625 4.02699 2.46317 4.46724 2.28008C5.10509 2.06012 5.77736 1.94516 6.45545 1.94008C7.50188 1.94008 7.88906 1.88008 10.6412 1.88008C13.3933 1.88008 13.7804 1.88008 14.8269 1.94008C15.4911 1.94736 16.1493 2.06232 16.7732 2.28008C17.2488 2.44873 17.6756 2.72292 18.0185 3.08008C18.3614 3.38726 18.6293 3.76281 18.8033 4.18008C19.0359 4.78901 19.1563 5.43186 19.1591 6.08008C19.2114 7.08008 19.2219 7.45008 19.2219 10.0801C19.2219 12.7101 19.2114 13.0801 19.1591 14.0801ZM10.6412 4.95008C9.57989 4.95205 8.54304 5.2546 7.66162 5.8195C6.78021 6.38439 6.09378 7.18627 5.68908 8.12383C5.28438 9.06139 5.17957 10.0925 5.38788 11.087C5.59619 12.0815 6.10828 12.9946 6.85945 13.7111C7.61062 14.4275 8.56715 14.9151 9.60819 15.1122C10.6492 15.3094 11.7281 15.2072 12.7084 14.8186C13.6886 14.43 14.5264 13.7725 15.1158 12.9291C15.7052 12.0857 16.0198 11.0943 16.0198 10.0801C16.0212 9.40518 15.8829 8.73668 15.613 8.11303C15.3431 7.48938 14.9468 6.92289 14.4469 6.44613C13.947 5.96937 13.3535 5.59176 12.7003 5.33501C12.0472 5.07826 11.3474 4.94744 10.6412 4.95008ZM10.6412 13.4101C9.95197 13.4101 9.27826 13.2148 8.70522 12.8489C8.13218 12.483 7.68555 11.9629 7.42181 11.3544C7.15807 10.7459 7.08906 10.0764 7.22351 9.43043C7.35797 8.78447 7.68984 8.19112 8.17718 7.72541C8.66451 7.2597 9.2854 6.94255 9.96135 6.81406C10.6373 6.68557 11.3379 6.75152 11.9747 7.00356C12.6114 7.2556 13.1556 7.68241 13.5385 8.23003C13.9214 8.77765 14.1258 9.42147 14.1258 10.0801C14.1258 10.5174 14.0356 10.9504 13.8605 11.3544C13.6854 11.7584 13.4287 12.1255 13.1052 12.4347C12.7816 12.744 12.3974 12.9892 11.9747 13.1566C11.5519 13.3239 11.0988 13.4101 10.6412 13.4101Z"
                    fill="#40B66B"
                  />
                </svg>
              </a>
              <a
                :href="
                  this.$store.state.contactInfo
                    ? this.$store.state.contactInfo.youtube
                    : '#'
                "
                class="mediaThumb"
                target="_blank"
              >
                <svg
                  width="24"
                  height="16"
                  viewBox="0 0 24 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23.7518 5.79006C23.8036 4.35872 23.476 2.93808 22.7996 1.66006C22.3406 1.13566 21.7037 0.781772 20.9997 0.660062C18.0881 0.407587 15.1644 0.304106 12.2411 0.350062C9.32855 0.302021 6.41536 0.402162 3.51392 0.650062C2.94029 0.749779 2.40943 1.0069 1.98613 1.39006C1.04435 2.22006 0.939702 3.64006 0.835059 4.84006C0.683235 6.99763 0.683235 9.1625 0.835059 11.3201C0.865333 11.9955 0.970566 12.6659 1.14899 13.3201C1.27516 13.8251 1.53043 14.2924 1.89195 14.6801C2.31813 15.0835 2.86135 15.3553 3.45113 15.4601C5.70714 15.7262 7.9803 15.8365 10.2529 15.7901C13.9154 15.8401 17.1279 15.7901 20.9265 15.5101C21.5308 15.4117 22.0893 15.1396 22.5275 14.7301C22.8205 14.45 23.0393 14.1072 23.1658 13.7301C23.5401 12.6327 23.7239 11.4842 23.71 10.3301C23.7518 9.77006 23.7518 6.39006 23.7518 5.79006ZM9.8762 10.9301V4.74006L16.0711 7.85006C14.334 8.77006 12.0423 9.81006 9.8762 10.9301Z"
                    fill="#40B66B"
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
                  width="22"
                  height="18"
                  viewBox="0 0 22 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.3052 2.88029C20.5186 3.20638 19.6868 3.42195 18.8356 3.52029C19.7336 3.00761 20.4066 2.20107 20.7296 1.25029C19.8857 1.73035 18.962 2.06858 17.9984 2.25029C17.3544 1.58286 16.4968 1.13858 15.5601 0.987139C14.6233 0.835694 13.6605 0.985646 12.8226 1.41348C11.9847 1.84131 11.319 2.52282 10.9301 3.35112C10.5411 4.17943 10.4509 5.10768 10.6734 5.99029C8.96716 5.90781 7.29813 5.48324 5.77475 4.74415C4.25137 4.00506 2.90774 2.96798 1.83112 1.70029C1.45351 2.33046 1.25508 3.04411 1.25559 3.77029C1.25425 4.44467 1.42743 5.1089 1.75971 5.70385C2.09199 6.2988 2.57306 6.806 3.16009 7.18029C2.47779 7.16255 1.81007 6.98759 1.21373 6.67029V6.72029C1.21884 7.66518 1.56532 8.57938 2.19456 9.30825C2.8238 10.0371 3.69717 10.5359 4.66694 10.7203C4.29364 10.8289 3.90606 10.8861 3.51587 10.8903C3.24578 10.8873 2.97636 10.8639 2.71012 10.8203C2.98629 11.6331 3.52071 12.3434 4.23903 12.8524C4.95736 13.3615 5.82385 13.6438 6.71794 13.6603C5.20816 14.7956 3.34414 15.4151 1.42302 15.4203C1.07323 15.4214 0.723724 15.4013 0.376587 15.3603C2.33804 16.5705 4.62384 17.213 6.95862 17.2103C8.5698 17.2263 10.1682 16.9353 11.6603 16.3544C13.1525 15.7734 14.5086 14.9142 15.6494 13.8268C16.7902 12.7394 17.6928 11.4457 18.3046 10.0212C18.9163 8.59671 19.2249 7.07001 19.2123 5.53029C19.2123 5.36029 19.2123 5.18029 19.2123 5.00029C20.0334 4.4151 20.7416 3.69771 21.3052 2.88029Z"
                    fill="#40B66B"
                  />
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
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.3041 0.080218H1.57756C1.37829 0.0775733 1.18044 0.112465 0.995288 0.182902C0.810138 0.253338 0.64132 0.357939 0.498477 0.49073C0.355633 0.623521 0.241562 0.781902 0.162777 0.956828C0.0839916 1.13175 0.0420361 1.3198 0.0393066 1.51022V18.6502C0.0420361 18.8406 0.0839916 19.0287 0.162777 19.2036C0.241562 19.3785 0.355633 19.5369 0.498477 19.6697C0.64132 19.8025 0.810138 19.9071 0.995288 19.9775C1.18044 20.048 1.37829 20.0829 1.57756 20.0802H19.3041C19.5033 20.0829 19.7012 20.048 19.8863 19.9775C20.0715 19.9071 20.2403 19.8025 20.3831 19.6697C20.526 19.5369 20.64 19.3785 20.7188 19.2036C20.7976 19.0287 20.8396 18.8406 20.8423 18.6502V1.51022C20.8396 1.3198 20.7976 1.13175 20.7188 0.956828C20.64 0.781902 20.526 0.623521 20.3831 0.49073C20.2403 0.357939 20.0715 0.253338 19.8863 0.182902C19.7012 0.112465 19.5033 0.0775733 19.3041 0.080218ZM6.34927 16.8202H3.20999V7.82022H6.34927V16.8202ZM4.77963 6.56022C4.34668 6.56022 3.93147 6.39586 3.62533 6.1033C3.31919 5.81075 3.1472 5.41396 3.1472 5.00022C3.1472 4.58648 3.31919 4.18969 3.62533 3.89713C3.93147 3.60457 4.34668 3.44022 4.77963 3.44022C5.00952 3.4153 5.24233 3.43707 5.46281 3.5041C5.6833 3.57113 5.88648 3.68191 6.05905 3.82918C6.23163 3.97645 6.3697 4.1569 6.46424 4.3587C6.55878 4.5605 6.60765 4.77911 6.60765 5.00022C6.60765 5.22132 6.55878 5.43993 6.46424 5.64174C6.3697 5.84354 6.23163 6.02398 6.05905 6.17126C5.88648 6.31853 5.6833 6.42931 5.46281 6.49633C5.24233 6.56336 5.00952 6.58513 4.77963 6.56022ZM17.6716 16.8202H14.5323V11.9902C14.5323 10.7802 14.0824 9.99022 12.9418 9.99022C12.5888 9.99269 12.245 10.0985 11.9569 10.2934C11.6688 10.4883 11.4501 10.7629 11.3303 11.0802C11.2484 11.3153 11.2129 11.5628 11.2256 11.8102V16.8102H8.08634C8.08634 16.8102 8.08634 8.63022 8.08634 7.81022H11.2256V9.08022C11.5108 8.60732 11.9256 8.21774 12.4253 7.95342C12.925 7.6891 13.4907 7.56007 14.0614 7.58022C16.1543 7.58022 17.6716 8.87022 17.6716 11.6402V16.8202Z"
                    fill="#40B66B"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "footer",
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
    openExternalLink(url) {
      window.open(url, '_blank');
    }
  }
};
</script>
