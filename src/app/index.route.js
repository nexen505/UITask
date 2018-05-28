export function routerConfig($stateProvider, $urlRouterProvider, archivedCriterions) {
  'ngInject';

  $stateProvider
    .state('main', {
      url: '/main',
      abstract: true,
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
        archived: archivedCriterions.NOT_ARCHIVED
      },
      views: {
        'content@main': {
          templateUrl: 'app/states/users/users.html',
          controller: 'UsersController',
          controllerAs: 'usersCtrl'
        }
      },
      resolve: {
        usersData: (UserService, $stateParams) => {
          'ngInject';

          return UserService.getAll($stateParams.archived);
        }
      }
    })
    .state('user', {
      url: '/:userId',
      parent: 'main.users',
      views: {
        'content@main': {
          templateUrl: 'app/states/userAchievementEntity/entity.template.html',
          controller: 'UserController',
          controllerAs: '$entityCtrl'
        }
      },
      resolve: {
        userData: (UserService, $stateParams) => {
          return UserService.get($stateParams.userId, true);
        }
      }
    })
    .state('main.achievements', {
      url: '/achievements?archived',
      params: {
        archived: archivedCriterions.NOT_ARCHIVED
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
          return AchievementService.getAll($stateParams.archived);
        }
      }
    })
    .state('achievement', {
      url: '/:achievementId?tab',
      parent: 'main.achievements',
      views: {
        'content@main': {
          templateUrl: 'app/states/userAchievementEntity/entity.template.html',
          controller: 'AchievementController',
          controllerAs: '$entityCtrl'
        }
      },
      resolve: {
        achievementData: (AchievementService, $stateParams) => {
          return AchievementService.get($stateParams.achievementId, true);
        }
      }
    });

  $urlRouterProvider.otherwise('/main/achievements');
}
