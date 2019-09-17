<template>
  <v-app>
    <CoreView />
  </v-app>
</template>

<script>
export default {
  components: {
    CoreView: () => import("@/components/core/View"),
  },
  created() {
    this.$vuetify.theme.dark = true;
  },
};
</script>
