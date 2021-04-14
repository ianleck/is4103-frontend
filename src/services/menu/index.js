export async function getPublicMenuData() {
  return [
    {
      title: 'Mentors',
      key: 'mentors',
      icon: 'fa fa-mortar-board',
      url: '/mentorships',
    },
    {
      title: 'Courses',
      key: 'courses',
      icon: 'fa fa-cubes',
      url: '/courses',
    },
  ]
}

export async function getStudentMenuData() {
  return [
    {
      title: 'Mentors',
      key: 'mentors',
      url: '/mentorships',
    },
    {
      title: 'Courses',
      key: 'courses',
      url: '/courses',
    },
    {
      title: 'Dashboard',
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
      icon: 'fe fe-briefcase',
      children: [
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
      icon: 'fe fe-film',
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
          title: 'Complaints',
          key: 'complaintContent',
          url: '/admin/complaint-content-management',
        },
      ],
    },
    {
      title: 'Finance Management',
      key: 'financeManagement',
      icon: 'fe fe-dollar-sign',
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
          title: 'Billings',
          key: 'billings',
          url: '/admin/billings',
        },
        {
          title: 'Wallets',
          key: 'wallets',
          url: '/admin/wallets',
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
          title: 'Mentorship Listings',
          key: 'mentorshipListings',
          url: '/sensei/mentorships/',
        },
        {
          title: 'Mentorship Applications',
          key: 'mentorshipApplications',
          url: '/sensei/mentorships/applications',
        },
        {
          title: 'Mentee Overview',
          key: 'menteeOverview',
          url: '/sensei/mentees',
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
      ],
    },
    {
      title: 'Social',
      key: 'social',
      icon: 'fe fe-user',
      children: [
        {
          title: 'Feed',
          key: 'mentorFeed',
          url: '/sensei/social/feed',
        },
        {
          title: 'My Profile',
          key: 'myProfile',
          url: '/sensei/profile',
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
          url: '/sensei/wallet',
        },
      ],
    },
  ]
}
