import {
  dashboardIcon,
  subscriptionIcon,
  webinarIcon,
  availableIcon,
  walletIcon,
  chatIcon,
  marketingIcon,
  settingIcon,
} from "../assets";

export const sideBar = [
  {
    id: 1,
    icon: dashboardIcon,
    title: "Dashboard",
    path: '/', 
  },
  {
    id: 2,
    icon: subscriptionIcon,
    title: "Subscription",
    path: '/subscription'
  },
  {
    id: 3,
    icon: webinarIcon,
    title: "Webinar",
    path: '/webinar'
  },
  {
    id: 4,
    icon: availableIcon,
    title: "Availability",
    path: '/availability'
  },
  {
    id: 5,
    icon: walletIcon,
    title: "Wallet",
    path: '/wallet'
  },
  {
    id: 6,
    icon: chatIcon,
    title: "Chats",
    path: '/chats'
  },
  {
    id: 7,
    icon: marketingIcon,
    title: "Marketing Par...",
    path: '/market'
  },
  {
    id: 8,
    icon: settingIcon,
    title: "Setting",
    path: '/setting'
  },
];
