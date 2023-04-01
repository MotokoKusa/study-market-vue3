<template>
  <teleport v-if="open" to="#teleport-target">
    <div class="modal__blackout"></div>
    <div class="modal__wrap" @click="onOutsideClick">
      <div ref="contentElement" class="modal__wrap__content">
        <slot />
        <button type="button" class="modal__wrap__close" @click="doClose">
          x
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

// export default {
//   name: "BaseModal",
//   props: {
//     open: {
//       type: Boolean,
//     },
//   },
//   methods: {
//     doClose() {
//       this.$emit("update:open", false);
//     },
//     onOutsideClick($event) {
//       if (
//         $event.target !== this.$refs.content &&
//         $event.target.contains(this.$refs.content)
//       ) {
//         this.doClose();
//       }
//     },
//     checkBlackoutState() {
//       if (!openedCount) {
//         atleastOneOpen = false;
//         document.body.style.overflow = null;
//         document.body.style.paddingRight = null;
//       } else if (!atleastOneOpen && openedCount === 1) {
//         atleastOneOpen = true;
//         document.body.style.paddingRight =
//           window.innerWidth - document.documentElement.clientWidth + "px";
//         document.body.style.overflow = "hidden";
//       }
//     },
//   },
//   watch: {
//     open: {
//       handler(isOpen) {
//         if (isOpen) {
//           openedCount += 1;
//         } else {
//           openedCount -= 1;
//         }
//         this.checkBlackoutState();
//       },
//     },
//   },
//   created() {
//     if (this.open) {
//       openedCount += 1;
//       this.checkBlackoutState();
//     }
//   },
// };
</script>

<style lang="scss" scoped>
.modal {
  &__blackout {
    z-index: 1010;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.75;
    background-color: #000;
  }
  &__wrap {
    z-index: 1010;
    overflow: auto;
    overflow-y: scroll;
    display: flex;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 20px;
    &__content {
      position: relative;
      max-width: 100%;
      margin: auto 0;
      padding: 40px;
      background-color: #fff;
    }
    &__close {
      position: absolute;
      top: -1.25em;
      top: -1.25em;
      padding: 10px;
      line-height: 1;
    }
  }
}
</style>
