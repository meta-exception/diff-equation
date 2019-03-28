<template>
  <q-page class="items-center wrap">
    <q-input
      v-model="input"
      :error="errorMsg ? true : false"
      :error-message="errorMsg"
      bottom-slots
      class="col-auto"
      autogrow
      filled
      type="textarea"
    >
      <template v-slot:default>
        <div ref="input" />
      </template>

      <template v-slot:append>
        <q-icon
          @click="processInput()"
          name="mdi-equal-box"
          class="q-mb-md self-end cursor-pointer"
        />
      </template>
    </q-input>

    <q-separator />

    <Graphics />

    <q-separator />

    <q-input v-model="output" class="col-auto" autogrow filled dense readonly />
  </q-page>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Graphics from 'components/Graphics';
import { validValue } from '../utils/examples.ts';

@Component({
  components: {
    Graphics,
  },
})
export default class PageIndex extends Vue {
  private input = validValue;

  processInput() {
    if (this.input.length) {
      this.$store.dispatch('grammarProcessor/process', this.input);
      const err = this.$store.getters['grammarProcessor/error'];
      if (err) {
        const textarea = (this.$refs.input as HTMLElement).previousSibling;
        if (textarea) {
          const { start, end } = err.token.token;
          (textarea as HTMLTextAreaElement).setSelectionRange(start, end);
          (textarea as HTMLTextAreaElement).focus();
        }
      }
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
// I have broken cursor on my laptop so I decided to switch it in app
.q-scrollarea__thumb {
  cursor: move !important;
}
</style>
