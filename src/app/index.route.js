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
    });

  $urlRouterProvider.otherwise('/main');
}
