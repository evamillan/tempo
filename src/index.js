import angular from 'angular';
import 'angular-spotify';

import {main} from './app/main.component';
import 'angular-ui-router';
import config from './config';

import './index.scss';

export const app = 'app';

angular
  .module(app, ['ui.router', 'spotify'])
  .config(config)
  .component('app', main);
