/* global malarkey:false, moment:false */

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './states/main/main.controller';
import { UserService } from "./components/service/user.service";
import { AchievementService } from "./components/service/achievement.service";
import { MdButtonDirective } from "./components/directive/button/button.directive";
import { UsersController } from "./states/users/users.controller";
import { AchievementsController } from "./states/achievements/achievements.controller";
import { ViewWrapperDirective } from "./components/directive/viewWrapper/viewWrapper.directive";
import { LoaderSpinnerDirective } from "./components/directive/loaderSpinner/loaderSpinner.directive";
import { MaterialSidenavDirective } from "./components/directive/sidenav/materialSidenav.directive";
import { MaterialInputDirective } from "./components/directive/input/materialInput.directive";
import { FileModelDirective } from "./components/directive/fileModel/fileModel.directive";
import { AchievementCardDirective } from "./states/directive/achievementUserCard/achievementCard/achievementCard.directive";
import { AchievementController } from "./states/achievements/achievement/achievement.controller";
import { UserController } from "./states/users/user/user.controller";
import { UserAchievementService } from "./components/service/userAchievement.service";
import { EventService } from "./components/utils/events.service";
import { UserCardDirective } from "./states/directive/achievementUserCard/userCard/userCard.directive";

angular.module('uitask', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ngScrollbars', 'ui.router', 'ngMaterial', 'toastr', 'ngdexie', 'ngdexie.ui', 'naif.base64'])
  .constant('malarkey', malarkey)
  .constant('moment', moment)
  .constant('_', window._)
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .service('EventService', EventService)
  .service('AchievementService', AchievementService)
  .service('UserService', UserService)
  .service('UserAchievementService', UserAchievementService)
  .controller('MainController', MainController)
  .controller('UsersController', UsersController)
  .controller('UserController', UserController)
  .controller('AchievementsController', AchievementsController)
  .controller('AchievementController', AchievementController)
  .directive('fileModel', FileModelDirective)
  .directive('achievementCard', AchievementCardDirective)
  .directive('userCard', UserCardDirective)
  .directive('materialButton', MdButtonDirective)
  .directive('materialInputContainer', MaterialInputDirective)
  .directive('viewWrapper', ViewWrapperDirective)
  .directive('materialSidenav', MaterialSidenavDirective)
  .directive('loaderSpinner', LoaderSpinnerDirective);
