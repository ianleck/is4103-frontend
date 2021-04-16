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
      icon: 'fe fe-book',
      url: '/courses',
    },
  ]
}

export async function getStudentMenuData() {
  return [
    {
      title: 'Mentors',
      key: 'mentors',
      icon: 'fa fa-graduation-cap',
      url: '/mentorships',
    },
    {
      title: 'Courses',
      key: 'courses',
      icon: 'fe fe-book',
      url: '/courses',
    },
    {
      title: 'Dashboard',
      key: 'studentDashboardAccess',
      icon: 'fa fa-pie-chart',
      url: '/student/dashboard/mentorships',
    },
  ]
}

export async function getAdminMenuData() {
  return [
    {
      title: 'Users',
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
      title: 'Content',
      key: 'contentManagement',
      icon: 'fe fe-folder',
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
      title: 'Finance',
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
      icon: 'fa fa-graduation-cap',
      // icon: 'fe fe-user',
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
          title: 'Mentorship Contracts',
          key: 'mentorshipContracts',
          url: '/sensei/mentorships/contracts',
        },
        {
          title: 'Mentee Overview',
          key: 'menteeOverview',
          url: '/sensei/mentees',
        },
        {
          title: 'Consultations',
          key: 'consultation',
          url: '/sensei/consultation',
        },
        {
          title: 'Testimonials',
          key: 'testimonials',
          url: '/sensei/testimonials',
        },
      ],
    },
    {
      title: 'Courses',
      key: 'courses',
      icon: 'fe fe-book',
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
      icon: 'fe fe-users',
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
          title: 'My Wallet',
          key: 'myWallet',
          url: '/sensei/wallet',
        },
      ],
    },
  ]
}
