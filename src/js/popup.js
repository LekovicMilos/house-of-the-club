import ApiKeyCollector from './pages/api-key-collector';
import React from 'react';
import {render} from 'react-dom';

import '../css/index.css';
import '../css/popup.css';

render(<ApiKeyCollector />, window.document.getElementById('popup-container'));
