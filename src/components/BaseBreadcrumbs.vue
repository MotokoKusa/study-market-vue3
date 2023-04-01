<template>
  <ul class="breadcrumbs">
    <li class="breadcrumbs__item" v-for="(el, idx) in crumbs" :key="idx">
      <router-link
        v-if="el.name"
        :to="{ name: el.name }"
        class="breadcrumbs__link"
        >{{ el.title }}</router-link
      >
      <p v-else class="breadcrumbs__link">{{ el.title }}</p>
    </li>
  </ul>
</template>

<script>
export default {
  name: "BaseBreadcrumbs",
  props: {
    crumbs: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
