<template>
  <s-header v-if="!isSomeOpen" />
  <router-view />
  <s-footer v-if="!isSomeOpen" />
  <div id="teleport-target"></div>
</template>
<script>
import SHeader from "@/components/SHeader";
import SFooter from "@/components/SFooter";
import useModal from "@/hooks/useModal";

export default {
  components: {
    SHeader,
    SFooter,
  },
  setup() {
    const { isSomeOpen } = useModal();
    return {
      isSomeOpen,
    };
  },
};
</script>

<style lang="scss">
@import "styles/style.scss";
</style>
