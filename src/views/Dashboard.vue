<template>
  <Counters />
</template>

<script>
export default {
  components: {
    Counters: () => import('@/components/core/Counters'),
  }
};
</script>
