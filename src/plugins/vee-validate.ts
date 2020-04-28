import { configure } from 'vee-validate';

const config = {
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid',
  },
};

// Sets the options.
configure(config);
