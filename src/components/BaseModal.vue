<template>
  <teleport v-if="open" to="#teleport-target">
    <div class="modal__blackout"></div>
    <div class="modal__wrap" @click="onOutsideClick">
      <div ref="contentElement" class="modal__wrap__content">
        <slot />
        <button type="button" class="modal__wrap__close" @click="doClose">
          &#10006;
        </button>
      </div>
    </div>
  </teleport>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import useModal from "@/hooks/useModal";
export default defineComponent({
  props: {
    open: {
      type: Boolean,
    },
  },
  setup(props, { emit }) {
    const contentElement = ref(null);

    const { doOpen, doClose } = useModal();
    const onOutsideClick = ($event) => {
      if (
        $event.target !== contentElement.value &&
        $event.target.contains(contentElement.value)
      ) {
        doCloseModal();
      }
    };

    const doCloseModal = () => {
      emit("update:open", false);
    };

    watch(
      () => props.open,
      (isOpen) => {
        if (isOpen) {
          doOpen();
        } else {
          doClose();
        }
      },
      { immediate: true }
    );

    if (props.open) {
      doOpen();
    }

    return {
      onOutsideClick,
      doClose: doCloseModal,
      contentElement,
    };
  },
});
</script>
