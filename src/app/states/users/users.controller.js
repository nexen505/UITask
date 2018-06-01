import { Utils } from "../../components/utils/utils.service";
import { User } from "../../components/model/user.model";
import { CardCollection } from "../../components/directive/card/cardCollection";

export class UsersController {
  constructor(_, UserService, $state, usersData) {
    'ngInject';

    this.UserService = UserService;
    this.$state = $state;
    this._ = _;

    this.users = new CardCollection(usersData);
    this.filters = {
      archivedKey: 'obj.archived',
      archivedValue: $state.params.archived,
      nameKey: 'obj.name',
      nameValue: $state.params.searchText
    };
    this.isCardAdding = false;
  }

  get archived() {
    return this.filters.archivedValue;
  }

  get searchText() {
    return this.filters.nameValue;
  }

  showArchived(archived = this.archived, searchText = this.searchText) {
    this.$state.go('main.users', {
      archived: archived,
      searchText: searchText
    }, {
      reload: true
    });
  }

  get newUser() {
    return this._newUser;
  }

  set newUser(user) {
    this._newUser = user;
  }

  get isCardAdding() {
    return this._isCardAdding;
  }

  set isCardAdding(value) {
    this._isCardAdding = value;
    this.newUser = new User();
  }

  openAddingCard() {
    this.isCardAdding = true;
  }

  closeAddingCard() {
    this.isCardAdding = false;
  }

  goToUser(userId = Utils.requiredParam()) {
    this.$state.go('user', {
      userId: userId
    });
  }

  editUser(user = Utils.requiredParam()) {
    this.closeAddingCard();
    const cards = this.users;

    user.closeEditingUser = ($event) => {
      this.closeUsers($event, user);
    };
    user.objCopy = angular.copy(user.obj);
    user.objCopy.original = user;
    cards.open(user);
  }

  closeUsers($event = Utils.requiredParam(), user = null) {
    const cards = this.users;

    $event.stopImmediatePropagation();
    cards.close(user);
  }

  saveNewUser(user = Utils.requiredParam(), $event = Utils.requiredParam()) {
    $event.stopImmediatePropagation();
    this.UserService.saveOrUpdate(user)
      .then((savedUser) => {
        this.users.push(savedUser);
        this.closeAddingCard();
      });
  }

  saveUser(user = Utils.requiredParam(), $event = Utils.requiredParam()) {
    $event.stopImmediatePropagation();
    this.UserService.saveOrUpdate(user)
      .then((savedUser) => {
        angular.extend(user.original, {
          obj: savedUser,
          objCopy: null
        });
        this.closeUsers($event);
      });
  }

  deleteUser(userCard = Utils.requiredParam(), $event = Utils.requiredParam()) {
    $event.stopImmediatePropagation();
    this.UserService.delete(userCard.obj.id)
      .then(() => {
        userCard.obj.archived = true;
      });
  }

  restoreUser(userCard = Utils.requiredParam(), $event = Utils.requiredParam()) {
    $event.stopImmediatePropagation();
    this.UserService.restore(userCard.obj.id)
      .then(() => {
        userCard.obj.archived = false;
      });
  }

}
