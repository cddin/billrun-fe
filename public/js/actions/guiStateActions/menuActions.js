import Immutable from 'immutable';
import mainMenu from '../../mainMenu.json';


export const PREPARE_MAIN_MENU_STRUCTURE = 'PREPARE_MAIN_MENU_STRUCTURE';

export const initMainMenu = (mainMenuOverrides = {}) => ({
  type: PREPARE_MAIN_MENU_STRUCTURE,
  mainMenuOverrides,
});

export const combineMenuOverrides = overrides => (
  Immutable.fromJS(mainMenu).withMutations((mainMenuTreeWithMutations) => {
    if (overrides && overrides.size) {
      overrides.forEach((menuData, menuKey) => {
        if (mainMenuTreeWithMutations.has(menuKey)) {
          menuData.forEach((value, menuProperty) => {
            mainMenuTreeWithMutations.setIn([menuKey, menuProperty], value);
          });
        }
      });
    }
  })
);

export const prossessMenuTree = (tree, parentId) => (
  tree
    .filter(menuItem => menuItem.get('parent') === parentId)// Filter tree level by parnet ID
    .map((menuItem, id) => menuItem.set('id', id)) // Set Id propertu from object key
    .toList() // Convert to Array
    .sort((menuItemA, menuB) => {
      const defaultOrder = 999;
      return (menuItemA.get('order', defaultOrder) < menuB.get('order', defaultOrder)) ? -1 : 1;
    }) // Sort menu level by order property
    .map((menuItem) => {
      const subtree = prossessMenuTree(tree, menuItem.get('id'));
      if (subtree.size) {
        return menuItem.set('subMenus', subtree);
      }
      return menuItem;
    }) // Build sub tree menus if exist
);
