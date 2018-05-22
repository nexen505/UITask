export function config($logProvider, toastrConfig, ngDexieProvider) {
  'ngInject';
  // Enable log
  $logProvider.debugEnabled(true);

  // Set options third-party lib
  toastrConfig.allowHtml = true;
  toastrConfig.timeOut = 3000;
  toastrConfig.positionClass = 'toast-top-right';
  toastrConfig.preventDuplicates = true;
  toastrConfig.progressBar = true;

  ngDexieProvider.setOptions({
    name: 'achievements',
    debug: false
  });
  ngDexieProvider.setConfiguration((db) => {
    db.version(3).stores({
      achievements: "++id,&name,description,karma,icon,archived",
      users: "++id,&name,bio,photo,archived",
      userAchievements: "++id,userId,achievementId,comment,date"
    });
  });
}
