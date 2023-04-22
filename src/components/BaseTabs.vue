<template>
  <ul class="tabs">
    <li class="tabs__item" v-for="(el, idx) in tabs" :key="idx">
      <a
        :class="[
          'tabs__link',
          'pointer',
          { 'tabs__link--current': selectedTab === el.name },
        ]"
        @click.prevent="selectTab(el.name)"
      >
        {{ el.text }}
      </a>
    </li>
  </ul>
</template>

<script>
import { ref } from "vue";

export default {
  name: "BaseTabs",

  props: {
    tabs: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const selectedTab = ref(props.tabs ? props.tabs[0].name : "");
    const selectTab = (e) => {
      selectedTab.value = e;
      emit("select-tab", selectedTab.value);
    };

    return {
      selectedTab,
      selectTab,
    };
  },
};
</script>
