import Project from '../pages/project/List';
import ProjectEdit from '../pages/project/Edit';
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
      path: '/project/list',
    },
    path: '/project/list',
    component: Project,
    exact: true,
  },
  {
    routeMateData: {
      id: 5,
      pid: 1,
      isMenu: false,
      title: '添加',
      path: '/project/add',
    },
    path: '/project/add',
    component: ProjectEdit,
    exact: true,
  },
  {
    routeMateData: {
      id: 2,
      pid: 0,
      isMenu: true,
      parent: 0,
      title: '设置',
      path: '/settings',
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
      path: '/about',
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
      path: '/demo',
    },
    path: '/demo',
    component: Demo,
  },
];
