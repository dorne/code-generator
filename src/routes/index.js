import Project from '../pages/Project';
import About from '../pages/About';
import Settings from '../pages/Settings';
import Demo from '../pages/Demo';

export const mainRoutes = [
  {
    routeMateData: {
      id: 1,
      pid: 0,
      isMenu: true,
      title: '项目',
    },
    path: '/',
    component: Project,
    exact: true,
  },

  {
    routeMateData: {
      id: 2,
      pid: 0,
      isMenu: true,
      parent: 0,
      title: '设置',
    },
    path: '/settings',
    component: Settings,
  },
  {
    routeMateData: {
      id: 3,
      pid: 0,
      isMenu: true,
      parent: 0,
      title: '关于',
    },
    path: '/about',
    component: About,
  },
  {
    routeMateData: {
      id: 4,
      pid: 0,
      isMenu: true,
      parent: 0,
      title: '样例',
    },
    path: '/demo',
    component: Demo,
  },
];
