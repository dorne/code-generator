import Project from '../pages/project/List';
import ProjectEdit from '../pages/project/Edit';
import TaskEdit from '../pages/project/task/Edit';
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
      match: '/project/list',
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
      title: '添加项目',
      path: '/project/add',
      match: '/project/add',
    },
    path: '/project/add',
    component: ProjectEdit,
    exact: true,
  },
  {
    routeMateData: {
      id: 6,
      pid: 1,
      isMenu: false,
      title: '编辑项目',
      path: '/project/edit/demo',
      match: ({ folderName }) => `/project/edit/${folderName}`,
    },
    path: '/project/edit/:folderName',
    component: ProjectEdit,
    exact: true,
  },
  {
    routeMateData: {
      id: 7,
      pid: 6,
      isMenu: false,
      title: '添加任务',
      path: '/project/edit/demo/task/add',
      match: ({ folderName }) => `/project/edit/${folderName}/task/add`,
    },
    path: '/project/edit/:folderName/task/add',
    component: TaskEdit,
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
      match: '/settings',
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
      match: '/about',
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
      match: '/demo',
    },
    path: '/demo',
    component: Demo,
  },
];
