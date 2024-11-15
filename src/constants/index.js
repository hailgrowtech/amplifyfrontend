import {
  dashboardIconactive,
  dashboardIconInactive,
  subscriptionIconactive,
  subscriptionIconInactive,
  webinarIcon,
  availableIcon,
  walletIconInactive,
  walletIconactive,
  chatIcon,
  marketingIcon,
  settingIconactive,
  settingIconInactive, telegramIcon,
  userImg, userBck,
  arrow, stars,
  edit, deleteIcon,
  invoiceImg,
  hdfc, kotak, icici,
  googlepay, paytm, phonepe, telegramChannelActive, telegramChannelInactive,
  standardQues, standardQuesInactive,
  webinarWhite, chatWhite,
} from "../assets";

export const sideBar = [
  {
    id: 'dashboard',
    activeIcon: dashboardIconactive,
    inactiveIcon: dashboardIconInactive,
    title: "Dashboard",
    path: '/', 
  },
  {
    id: 'subscription',
    activeIcon: subscriptionIconactive,
    inactiveIcon: subscriptionIconInactive,
    title: "Subscription",
    path: '/subscription'
  },
  {
    id: 'call_post',
    activeIcon: webinarWhite,
    inactiveIcon: webinarIcon,
    title: "Calls Post",
    path: '/call_post'
  },
  {
    id: 'feed_post',
    activeIcon: webinarWhite,
    inactiveIcon: webinarIcon,
    title: "Feed Post",
    path: '/feed_post'
  },
  // {
  //   id: 'webinar',
  //   activeIcon: webinarWhite,
  //   inactiveIcon: webinarIcon,
  //   title: "Webinar",
  //   path: '/webinar'
  // },
  // {
  //   id: 'availability',
  //   icon: availableIcon,
  //   title: "Availability",
  //   path: '/availability'
  // },
  {
    id: 'wallet',
    activeIcon: walletIconactive,
    inactiveIcon: walletIconInactive,
    title: "Wallet",
    path: '/wallet'
  },
  {
    id: 'chats',
    activeIcon: chatWhite,
    inactiveIcon: chatIcon,
    title: "Chats",
    path: '/chats'
  },
  // {
  //   id: 'marketing',
  //   icon: marketingIcon,
  //   title: "Marketing",
  //   path: '/market'
  // },
  {
    id: 'telegram_channel',
    activeIcon: telegramChannelActive,
    inactiveIcon: telegramChannelInactive,
    title: "Telegram Channel",
    path: '/telegram_channel'
  },
  // {
  //   id: 'standard_questions',
  //   activeIcon: standardQues,
  //   inactiveIcon: standardQuesInactive,
  //   title: "Standard Question",
  //   path: '/standard_questions'
  // },
  {
    id: 'setting',
    activeIcon: settingIconactive,
    inactiveIcon: settingIconInactive,
    title: "Setting",
    path: '/setting'
  },
];


export const userAnalysis = [
  {
    id: 1,
    telegramIcon: telegramIcon,
    joined: 'Today',
    telegram: 'Telegram',
    totalVisit: 'Total Visit',
    totalVisitIs: '100',
    user: 'Paid User',
    totalUser: '+40',
    noInterested: 'Not Interested',
    noInterestedIs: '60'
  },
]

export const expertise_data = [
  {
    id: "1",
    icon: userBck,
    userImg: userImg,
    name: "Arun Kumar",
    title: "Commodity",
    ratingIcon: stars,
    rating: "4.4",
    experience: "Experience",
    totalExp: "7+",
    followers: "Followers",
    totalFollowers: "3.1k",
    content:
      "SEBI: 78r94865r130124253",
    telegram: telegramIcon,
    greet: "Telegram channel Link: https://web.telegram.org/k/",
    arrowIcon: arrow,
    basicTitle: 'Basic',
    price: '₹2,999',
    access: '/1 Month Access',
    activeUser: 'Active User:',
    valueActiveUser: '60/100',
  },
]

export const subscriptionData = [
  {
    date: "26/01/2024",
    subType: 'Futures & Options',
    plan: "Basic",
    duration: "1 month",
    phNum: '9910382771',
    amount: "₹1,999 ",
    activeUser: '2000',
    activeEdit: edit,
    activeDel: deleteIcon
  },
  {
    date: "26/01/2024",
    subType: 'Commodity',
    plan: "Standard",
    duration: "3 month",
    phNum: '7129991181',
    amount: "₹5,999 ",
    activeUser: '5000',
    activeEdit: edit,
    activeDel: deleteIcon
  },
]
