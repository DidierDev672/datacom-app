<template>
  <q-item
    clickable
    tag="a"
    target="_self"
    :to="link"
    exact
    class="sidebar-item"
    active-class="sidebar-item--active"
  >
    <q-item-section
      v-if="icon"
      avatar
      class="sidebar-icon-section"
    >
      <q-icon size="18px" :name="icon" class="sidebar-icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="sidebar-item-label">{{ title }}</q-item-label>
      <q-item-label v-if="caption" caption class="sidebar-item-caption">
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    }
  }
}
</script>
