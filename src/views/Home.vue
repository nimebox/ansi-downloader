<template>
  <v-flex class="mx-5">
    <v-card>
      <search />
    </v-card>
  </v-flex>
</template>

<script>
import Search from '@/components/Search.vue'
export default {
  name: 'home',
  components: { Search }
}
</script>
