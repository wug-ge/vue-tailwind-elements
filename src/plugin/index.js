const styles = require('./styles');
const plugin = require('tailwindcss/plugin');
const buttons = require( './buttons');
const pagination = require('./pagination');

module.exports = plugin(
  ({ addComponents, theme }) => {
    addComponents(styles);
    addComponents(buttons(theme));
    addComponents(pagination(theme));
  },
  {}
);