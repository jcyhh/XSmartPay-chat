import { t } from '@/main';
import copy from 'copy-to-clipboard';
import { Toast } from 'vant';

export default {
  bind(el, { value }) {
    el.addEventListener('click', () => {
      const text = value && el._copyValue ? el._copyValue : value
      const success = copy(text);
      if (success) {
        Toast.success(t('复制成功'));
      } else {
        Toast.fail(t('复制失败'));
      }
    });
  },
  componentUpdated(el, { value }) {
    el._copyValue = value;
  }
};