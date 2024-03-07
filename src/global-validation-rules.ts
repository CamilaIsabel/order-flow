import { defineRule } from 'vee-validate';
import {
  email,
  min,
  max,
  required,
  confirmed,
  max_value,
  min_value,
} from '@vee-validate/rules';

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);
defineRule('confirmed', confirmed);
defineRule('max_value', max_value);
defineRule('min_value', min_value);
