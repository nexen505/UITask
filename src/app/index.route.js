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
      url: '/users?archived',
      params: {
        archived: '0'
      },
      views: {
        'content@main': {
          templateUrl: 'app/states/users/users.html',
          controller: 'UsersController',
          controllerAs: 'usersCtrl'
        }
      },
      resolve: {
        usersData: (UserService, $stateParams, $log) => {
          'ngInject';

          return UserService.getAll($stateParams.archived === '1');
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
      url: '/achievements?archived',
      params: {
        archived: '0'
      },
      views: {
        'content@main': {
          templateUrl: 'app/states/achievements/achievements.html',
          controller: 'AchievementsController',
          controllerAs: 'achievementsCtrl'
        }
      },
      resolve: {
        achievementsData: (AchievementService, $stateParams) => {
          'ngInject';

          return AchievementService.getAll($stateParams.archived === '1');
        }
      }
    })
    .state('achievement', {
      url: '/:achievementId?tab',
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
