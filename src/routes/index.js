import Project from '../pages/Project';
import About from '../pages/About';
import Settings from '../pages/Settings';
import Demo from '../pages/Demo';

export const mainRoutes = [
  {
    mateData: {
      isMenu: true,
      parent: 0,
      name: '项目',
    },
    path: '/',
    component: Project,
    exact: true,
  },

  {
    mateData: {
      isMenu: true,
      parent: 0,
      name: '设置',
    },
    path: '/settings',
    component: Settings,
  },
  {
    mateData: {
      isMenu: true,
      parent: 0,
      name: '关于',
    },
    path: '/about',
    component: About,
  },
  {
    mateData: {
      isMenu: true,
      parent: 0,
      name: '样例',
    },
    path: '/demo',
    component: Demo,
  },
];
