export function routerConfig($stateProvider, $urlRouterProvider) {
  'ngInject';

  $stateProvider
    .state('main', {
      url: '/main',
      views: {
        'main': {
          templateUrl: 'app/states/main/main.html',
          controller: 'MainController',
          controllerAs: 'mainCtrl'
        }
      }
    })
    .state('main.users', {
      url: '/users',
      views: {
        'content@main': {
          templateUrl: 'app/states/users/users.html',
          controller: 'UsersController',
          controllerAs: 'usersCtrl'
        }
      },
      resolve: {
        usersData: (UserService) => {
          'ngInject';

          return UserService.getAll(false);
        }
      }
    })
    .state('user', {
      url: '/:userId',
      parent: 'main.users',
      views: {
        'content@main': {
          templateUrl: 'app/states/users/user/user.html',
          controller: 'UserController',
          controllerAs: 'userCtrl'
        }
      },
      resolve: {
        userData: (UserService, $stateParams) => {
          'ngInject';

          return UserService.get($stateParams.userId, true);
        }
      }
    })
    .state('main.achievements', {
      url: '/achievements',
      views: {
        'content@main': {
          templateUrl: 'app/states/achievements/achievements.html',
          controller: 'AchievementsController',
          controllerAs: 'achievementsCtrl'
        }
      },
      resolve: {
        achievementsData: (AchievementService) => {
          'ngInject';

          return AchievementService.getAll(false);
        }
      }
    })
    .state('achievement', {
      url: '/:achievementId',
      parent: 'main.achievements',
      views: {
        'content@main': {
          templateUrl: 'app/states/achievements/achievement/achievement.html',
          controller: 'AchievementController',
          controllerAs: 'achievementCtrl'
        }
      },
      resolve: {
        achievementData: (AchievementService, $stateParams) => {
          'ngInject';

          return AchievementService.get($stateParams.achievementId, true);
        }
      }
    });

  $urlRouterProvider.otherwise('/main');
}
