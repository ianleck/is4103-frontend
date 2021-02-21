export async function getPublicMenuData() {
  return [
    {
      title: 'Mentors',
      key: 'mentors',
      icon: 'fa fa-mortar-board',
      url: '/browse/mentors',
    },
    {
      title: 'Courses',
      key: 'courses',
      icon: 'fa fa-cubes',
      url: '/browse/courses',
    },
  ]
}

export async function getStudentMenuData() {
  return [
    {
      title: 'Mentors',
      key: 'mentors',
      icon: 'fa fa-mortar-board',
      url: '/browse/mentors',
    },
    {
      title: 'Courses',
      key: 'courses',
      icon: 'fa fa-cubes',
      url: '/browse/courses',
    },
    {
      title: 'My Dashboard',
      key: 'studentDashboardAccess',
      url: '/student/dashboard',
    },
  ]
}

export async function getAdminMenuData() {
  return [
    {
      title: 'Users Management',
      key: 'userManagement',
      icon: 'fe fe-users',
      children: [
        {
          title: 'Users',
          key: 'userManagement',
          url: '/admin/user-management',
        },
        {
          title: 'Admin',
          key: 'adminManagement',
          url: '/admin/admin-management',
        },
      ],
    },
    {
      title: 'Business Management',
      key: 'businessManagement',
      icon: 'fe fe-printer',
      children: [
        {
          title: 'Revenue',
          key: 'revenue',
          url: '/admin/revenue-management',
        },
        {
          title: 'Profit',
          key: 'profit',
          url: '/admin/profit',
        },
        {
          title: 'User Statistics',
          key: 'userStatistics',
          url: '/admin/user-statistics',
        },
      ],
    },
    {
      title: 'Content Management',
      key: 'contentManagement',
      icon: 'fe fe-music',
      children: [
        {
          title: 'Mentorship',
          key: 'mentorshipContent',
          url: '/admin/mentorship-content-management',
        },
        {
          title: 'Courses',
          key: 'courseContent',
          url: '/admin/course-content-management',
        },
        {
          title: 'Announcements',
          key: 'announcementContent',
          url: '/admin/announcement-content-management',
        },
        {
          title: 'Complaints',
          key: 'complaintContent',
          url: '/admin/complaint-content-management',
        },
      ],
    },
    {
      title: 'Finance Management',
      key: 'financeManagement',
      icon: 'fe fe-thermometer',
      children: [
        {
          title: 'Withdrawals',
          key: 'withdrawals',
          url: '/admin/withdrawals',
        },
        {
          title: 'Refunds',
          key: 'refunds',
          url: '/admin/refunds',
        },
        {
          title: 'Transactions',
          key: 'transactions',
          url: '/admin/transactions',
        },
      ],
    },
  ]
}

export async function getSenseiMenuData() {
  return [
    {
      title: 'Mentorship',
      key: 'mentorship',
      icon: 'fe fe-user',
      children: [
        {
          title: 'Review Applications',
          key: 'reviewApplications',
          url: '/sensei/reviewApplications',
        },
        {
          title: 'Mentee Overview',
          key: 'menteeOverview',
          url: '/sensei/menteeOverview',
        },
        {
          title: 'Tasks',
          key: 'tasks',
          url: '/sensei/tasks',
        },
        {
          title: 'Testimonials',
          key: 'testimonials',
          url: '/sensei/testimonials',
        },
        {
          title: 'Chat/Video Call',
          key: 'chatVideoCall',
          url: '/sensei/chatVideoCall',
        },
      ],
    },
    {
      title: 'Courses',
      key: 'courses',
      icon: 'fe fe-layers',
      children: [
        {
          title: 'Courses',
          key: 'courses',
          url: '/sensei/courses',
        },
        {
          title: 'Announcements',
          key: 'announcements',
          url: '/sensei/announcements',
        },
      ],
    },
    {
      title: 'Profile',
      key: 'profile',
      icon: 'fe fe-user',
      children: [
        {
          title: 'Mentor Feed',
          key: 'mentorFeed',
          url: '/sensei/mentorFeed',
        },
        {
          title: 'My Profile',
          key: 'myProfile',
          url: '/sensei/myProfile',
        },
      ],
    },
    {
      title: 'Sales',
      key: 'sales',
      icon: 'fe fe-shopping-cart',
      children: [
        {
          title: 'Statistics',
          key: 'statistics',
          url: '/sensei/statistics',
        },
        {
          title: 'My Wallet',
          key: 'myWallet',
          url: '/sensei/myWallet',
        },
      ],
    },
  ]
}
