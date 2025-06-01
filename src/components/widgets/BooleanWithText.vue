<template>
  <div class="row q-col-gutter-sm">
    <div class="col-xs-12">
      <p class="text-h6">{{ question }}?</p>
      <q-option-group inline :options="options" type="radio" :value="modelValue" @input="$emit('update:modelValue', $event)" />
    </div>
    <div class="col-xs-12 q-mt-sm" v-if="modelValue">
      <p class="text-h6">{{ textLabel }}</p>
      <q-input outlined :value="textValue" @blur="$emit('update:textValue', $event)" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BooleanWithText',
  props: {
    question: {
      type: String,
      required: true
    },
    textLabel: {
      type: String,
      required: true
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    textValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      options: [
        { label: 'Si', value: true },
        { label: 'No', value: false }
      ]
    };
  }
};
</script>