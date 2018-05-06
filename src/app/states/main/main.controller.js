export class MainController {
  constructor($state) {
    'ngInject';

    this.isSidenavOpen = $state.current.name === 'main';
  }

  get isSidenavOpen() {
    return this._isSidenavOpen;
  }

  set isSidenavOpen(value) {
    this._isSidenavOpen = value;
  }
}
