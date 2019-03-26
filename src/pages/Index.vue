<template>
  <q-page class="row flex flex-center">
    <q-input
      v-model="input"
      :error="errorMsg ? true : false"
      :error-message="errorMsg"
      bottom-slots
      class="col-10"
      autogrow
      filled
      type="textarea"
    >
      <template v-slot:append>
        <q-icon
          @click="processInput()"
          name="mdi-equal-box"
          class="q-mb-md self-end cursor-pointer"
        />
      </template>
    </q-input>

    <q-input v-model="output" class="col-10" autogrow filled dense readonly />
  </q-page>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { validValue } from '../utils/examples.ts';

@Component
export default class PageIndex extends Vue {
  private input = validValue;

  processInput() {
    if (this.input.length) {
      this.$store.dispatch('grammarProcessor/process', this.input);
    }
  }

  get output() {
    return this.$store.getters['grammarProcessor/output'];
  }

  get errorMsg() {
    const err = this.$store.getters['grammarProcessor/error'];
    if (err) {
      return err.message;
    }
    return null;
  }
}
</script>

<style lang="scss">
.q-field__append {
  height: 100%;
}
</style>
