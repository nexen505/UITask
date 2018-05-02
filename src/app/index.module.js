/* global malarkey:false, moment:false */

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './states/main/main.controller';
import { UserService } from "./components/service/user.service";
import { AchievementService } from "./components/service/achievement.service";
import { Utils } from "./components/utils/utils.service";
import { MdButtonDirective } from "./components/directive/button/button.directive";
import { UsersController } from "./states/users/users.controller";
import { AchievementsController } from "./states/achievements/achievements.controller";
import { ViewWrapperDirective } from "./components/directive/viewWrapper/viewWrapper.directive";
import { LoaderSpinnerDirective } from "./components/directive/loaderSpinner/loaderSpinner.directive";
import { MaterialSidenavDirective } from "./components/directive/sidenav/materialSidenav.directive";
import { MaterialInputDirective } from "./components/directive/input/materialInput.directive";

angular.module('uitask', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ui.router', 'ngMaterial', 'toastr', 'ngdexie', 'ngdexie.ui'])
  .constant('malarkey', malarkey)
  .constant('moment', moment)
  .constant('_', window._)
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .service('UtilsService', Utils)
  .service('AchievementService', AchievementService)
  .service('UserService', UserService)
  .controller('MainController', MainController)
  .controller('UsersController', UsersController)
  .controller('AchievementsController', AchievementsController)
  .directive('materialButton', MdButtonDirective)
  .directive('materialInputContainer', MaterialInputDirective)
  .directive('viewWrapper', ViewWrapperDirective)
  .directive('materialSidenav', MaterialSidenavDirective)
  .directive('loaderSpinner', LoaderSpinnerDirective);
