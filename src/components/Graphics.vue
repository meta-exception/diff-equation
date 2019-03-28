<template>
  <q-scroll-area :style="maxHeight()" horizontal class="col-auto">
    <div class="row no-wrap">
      <div v-for="figure in renderQueue">
        <svg
          v-if="figure.type === 'circle'"
          :width="offset + figure.radius * 2"
          :height="offset + figure.radius * 2"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            :r="figure.radius"
            :cy="figure.radius / 2"
            :cx="figure.radius / 2"
            :fill="figure.fill"
            :transform="moveFigure(figure.radius / 2, figure.radius / 2)"
          />
        </svg>
        <svg
          v-else-if="figure.type === 'rect'"
          :width="offset + figure.width"
          :height="offset + figure.height"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            :width="figure.width"
            :height="figure.height"
            :cy="figure.width / 2"
            :cx="figure.height / 2"
            :fill="figure.fill"
            :transform="moveFigure(0, 0)"
          />
        </svg>
      </div>
    </div>
  </q-scroll-area>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Graphics extends Vue {
  private offset = 20;

  maxHeight() {
    const defaultHeight = 200;
    const max = this.renderQueue
      .map((el: any) => {
        if (el.radius) {
          return el.radius * 2;
        }
        return el.height;
      })
      .reduce((acc: number, curr: number) => Math.max(curr, acc));
    if (max && max > defaultHeight) {
      const height = this.offset * 2 + Math.round(max);
      return `height: ${height}px;`;
    }
    return `height: ${defaultHeight}px;`;
  }

  get renderQueue() {
    return this.$store.getters['grammarProcessor/renderQueue'];
  }

  moveFigure(x: number, y: number) {
    return `translate(${this.offset + x}, ${this.offset + y})`;
  }
}
</script>
