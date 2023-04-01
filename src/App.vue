<template>
  <s-header />
  <router-view />
  <s-footer />
  <div id="teleport-target"></div>
</template>
<script>
import SHeader from "@/components/SHeader";
import SFooter from "@/components/SFooter";

export default {
  components: {
    SHeader,
    SFooter,
  },
};
</script>
