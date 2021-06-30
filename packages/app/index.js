/**
 * @fileoverview Index file.
 * @flow
 */
// eslint-disable-next-line import/extensions
import 'regenerator-runtime/runtime';
import 'core-js/stable';
import 'core-js/features';

import { render } from 'react-dom';

import Root from './Root';

/* eslint-enable */

render(<Root />, document.getElementById('root'));
