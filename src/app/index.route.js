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
      url: '/users?archived?searchText',
      params: {
        archived: archivedCriterions.NOT_ARCHIVED
      },
      views: {
        'content@main': {
          templateUrl: 'app/states/users/users.html',
          controller: 'UsersController',
          controllerAs: '$entitiesCtrl'
        }
      },
      resolve: {
        usersData: (UserService, $stateParams) => {
          return UserService.getAll($stateParams.archived, $stateParams.searchText);
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
      url: '/achievements?archived?searchText',
      params: {
        archived: archivedCriterions.NOT_ARCHIVED
      },
      views: {
        'content@main': {
          templateUrl: 'app/states/achievements/achievements.html',
          controller: 'AchievementsController',
          controllerAs: '$entitiesCtrl'
        }
      },
      resolve: {
        achievementsData: (AchievementService, $stateParams) => {
          return AchievementService.getAll($stateParams.archived, $stateParams.searchText);
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
