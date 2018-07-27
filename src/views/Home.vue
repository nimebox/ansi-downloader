<template>
  <v-flex xs12>
    <v-card>
        <search />
    </v-card>
  </v-flex>
</template>

<script>
import Search from '@/components/Search'
export default {
  name: 'home',
  components: { Search }
}
</script>
