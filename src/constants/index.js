import {
  userImg,
  userBck,
  stars,
  telegram,
  arrow,
  expertise,
  stock_1,
  stock_2,
  stock_3,
  secondExpertise,
  courseImg,
  courseImg2,
  courseImg3,
  courseUser,
  testimonialImg,
  invoiceImg,
  vision, vision2,
  aboutFeature, aboutFeature2, aboutFeature3,
  Blog1,
  Blog2,
  Blog3,
  Blog4,
  Blog5,
} from "../assets";

export const navLinks = [
  {
    id: "home",
    title: "Home",
  },
  {
    id: "subscription",
    title: "Subscription",
  },
  {
    id: "expertise",
    title: "Expertise",
  },
  {
    id: "history",
    title: "History",
  },
  {
    id: "contact_us",
    title: "Contact Us",
  },
  {
    id: "profile",
    title: "Profile",
  },
];

export const expertise_type = [
  {
    id: 1,
    image: expertise,
    title: "Futures",
    followers: "4K + More",
    describe:
      "Our SEBI Registered experts with their expertise, help traders gain a deeper understanding of risk management, leverage, and market dynamics for profitability.",
    button: "Explore All",
    arrowIcon: arrow,
  },
  {
    id: 2,
    image: expertise,
    title: "Commodity",
    followers: "4K + More",
    describe:
      "Our experts simplify trading complexities like understanding different assets and their correlations, guiding you with different strategies and market dynamics.",
    button: "Explore All",
    arrowIcon: arrow,
  },
  {
    id: 3,
    image: expertise,
    image2: secondExpertise,
    title: "Equity",
    followers: "4K + More",
    describe:
      "Our experts thrive into the world of stocks, offering comprehensive guidance on analysing companies, understanding market trends and making informed investment decisions.",
    button: "Explore All",
    arrowIcon: arrow,
  },
];

export const courses = [
  {
    imageUrl: courseImg,
    title: "Insights at your fingertips",
    instructor: "Rohit Aggi",
    followers: "3.1k",
    experience: "7+",
    duration: "3 hrs",
    session: "3",
    price: "₹1,999/-",
  },
  {
    imageUrl: courseImg,
    title: "Insights at your fingertips",
    instructor: "Rohit Aggi",
    followers: "2.5k",
    experience: "5+",
    duration: "2 hrs",
    session: "2",
    price: "₹1,499/-",
  },

  {
    imageUrl: courseImg,
    title: "Insights at your fingertips",
    instructor: "Rohit Aggi",
    followers: "2.5k",
    experience: "5+",
    duration: "2 hrs",
    session: "2",
    price: "₹1,499/-",
  },
  {
    imageUrl: courseImg,
    title: "Insights at your fingertips",
    instructor: "Rohit Aggi",
    followers: "2.5k",
    experience: "5+",
    duration: "2 hrs",
    session: "2",
    price: "₹1,499/-",
  },
  {
    imageUrl: courseImg,
    title: "Insights at your fingertips",
    instructor: "Rohit Aggi",
    followers: "2.5k",
    experience: "5+",
    duration: "2 hrs",
    session: "2",
    price: "₹1,499/-",
  },
  {
    imageUrl: courseImg,
    title: "Insights at your fingertips",
    instructor: "Rohit Aggi",
    followers: "3.1k",
    experience: "7+",
    duration: "3 hrs",
    session: "3",
    price: "₹1,999/-",
  },
];

export const testimonialsData = [
  {
    id: 1,
    text: "Since 2019, Gravity team has been an astounding market maker for Bitkub. They have proven themselves to be one of the most consistent, committed and driven market makers on our exchange. Gravity Team has contributed high-quality volume and has proven to be very reliable and trustworthy partner. We strongly advocate Gravity Team as they have been an indispensable part of our market-making team.",
    author: "Atthakrit Chimplapibul",
    image: testimonialImg,
    designation: "CEO, Company A",
  },
  {
    id: 2,
    text: "Since 2019, Gravity team has been an astounding market maker for Bitkub. Gravity Team has contributed high-quality volume and has proven to be very reliable and trustworthy partner. We strongly advocate Gravity Team as they have been an indispensable part of our market-making team.",
    author: "Jane Smith",
    image: testimonialImg,
    designation: "CTO, Company B",
  },
  {
    id: 3,
    text: "Becoming an affiliate partner was a great decision. The referral program is rewarding and easy to use.",
    author: "Bob Johnson",
    image: testimonialImg,
    designation: "COO, Company C",
  },
];

// export const hero_experience = [
//   {
//     id: "1",
//     icon: userBck,
//     userImg: userImg,
//     name:"Arun Kumar",
//     content:
//       "The best credit cards offer some tantalizing combinations of promotions and prizes",
//   },
//   {
//     id: "2",
//     icon: shield,
//     title: "100% Secured",
//     content:
//       "We take proactive steps make sure your information and transactions are secure.",
//   },
//   {
//     id: "3",
//     icon: send,
//     title: "Balance Transfer",
//     content:
//       "A balance transfer credit card can save you a lot of money in interest charges.",
//   },
// ];

export const expertise_data = [
  {
    id: "1",
    icon: userBck,
    userImg: userImg,
      name: "EesheePal Singh",
    title: "Commodity",
    ratingIcon: stars,
    rating: "4.4",
    experience: "Experience",
    totalExp: "7+",
    followers: "Followers",
    totalFollowers: "3.1k",
    content:
      "8979879234",
    telegram: telegram,
    price: "1,999/month",
    greet: "Get Free Calls",
    arrowIcon: arrow,
      keyHighlights: [
        "Expert in technical analysis",
        "Proven track record of successful investments",
        "In-depth knowledge of market trends",
        "Effective risk management strategies",
      ],
  },
  // {
  //   id: "2",
  //   icon: userBck,
  //   userImg: userImg,
  //     name: "Parvez Alam",
  //     title: "Equity",
  //   ratingIcon: stars,
  //   rating: "4.4",
  //   experience: "Experience",
  //   totalExp: "7+",
  //   followers: "Followers",
  //   totalFollowers: "3.1k",
  //   content:
  //     "8979879234",
  //   telegram: telegram,
  //   price: "1,999/month",
  //   greet: "Get Free Calls",
  //   arrowIcon: arrow,
  //     keyHighlights: [
  //       "Expert in technical analysis",
  //       "Proven track record of successful investments",
  //       "In-depth knowledge of market trends",
  //       "Effective risk management strategies",
  //     ],
  // },
  // {
  //   id: "3",
  //   icon: userBck,
  //   userImg: userImg,
  //     name: "Vinit Chaudary",
  //     title: "Options",
  //   ratingIcon: stars,
  //   rating: "4.4",
  //   experience: "Experience",
  //   totalExp: "7+",
  //   followers: "Followers",
  //   totalFollowers: "3.1k",
  //   content:
  //     "8979879234",
  //   telegram: telegram,
  //   price: "1,999/month",
  //   greet: "Get Free Calls",
  //   arrowIcon: arrow,
  //     keyHighlights: [
  //       "Expert in technical analysis",
  //       "Proven track record of successful investments",
  //       "In-depth knowledge of market trends",
  //       "Effective risk management strategies",
  //     ],
  // },
  // {
  //   id: "4",
  //   icon: userBck,
  //   userImg: userImg,
  //     name: "Salman Khan",
  //     title: "Commodity",
  //   ratingIcon: stars,
  //   rating: "4.4",
  //   experience: "Experience",
  //   totalExp: "7+",
  //   followers: "Followers",
  //   totalFollowers: "3.1k",
  //   content:
  //     "8979879234",
  //   telegram: telegram,
  //   price: "1,999/month",
  //   greet: "Get Free Calls",
  //   arrowIcon: arrow,
  //     keyHighlights: [
  //       "Expert in technical analysis",
  //       "Proven track record of successful investments",
  //       "In-depth knowledge of market trends",
  //       "Effective risk management strategies",
  //     ],
  // },
  // {
  //   id: "5",
  //   icon: userBck,
  //   userImg: userImg,
  //     name: "Kamalar Khan",
  //     title: "Equity",
  //   ratingIcon: stars,
  //   rating: "4.4",
  //   experience: "Experience",
  //   totalExp: "7+",
  //   followers: "Followers",
  //   totalFollowers: "3.1k",
  //   content:
  //     "8979879234",
  //   telegram: telegram,
  //   price: "1,999/month",
  //   greet: "Get Free Calls",
  //   arrowIcon: arrow,
  //     keyHighlights: [
  //       "Expert in technical analysis",
  //       "Proven track record of successful investments",
  //       "In-depth knowledge of market trends",
  //       "Effective risk management strategies",
  //     ],
  // },
  // {
  //   id: "6",
  //   icon: userBck,
  //   userImg: userImg,
  //     name: "Dhinchak Pooja",
  //     title: "Options",
  //   ratingIcon: stars,
  //   rating: "4.4",
  //   experience: "Experience",
  //   totalExp: "7+",
  //   followers: "Followers",
  //   totalFollowers: "3.1k",
  //   content:
  //     "8979879234",
  //   telegram: telegram,
  //   price: "1,999/month",
  //   greet: "Get Free Calls",
  //   arrowIcon: arrow,
  //     keyHighlights: [
  //       "Expert in technical analysis",
  //       "Proven track record of successful investments",
  //       "In-depth knowledge of market trends",
  //       "Effective risk management strategies",
  //     ],
  // },
];

export const stock_data = [
  {
    id: "1",
    content:
      "Our platform offers easy-to-use tools and customised services to traders, authorised by SEBI registered Research Analysts, making it simple to execute trades and manage the portfolio.",
    title: "For Traders",
    img: stock_1,
  },
  {
    id: "2",
    content:
      "Connect with traders actively seeking valuable information, ensuring your analysis reaches an interested audience that enhances your visibility and credibility.",
    title: "For RAs",
    img: stock_2,
  },
  {
    id: "3",
    content:
      "A one stop solution platform that provides a transparent access to comprehensive analysis and a vibrant network of traders and experts and resources needed for informed decision-making and profitable trading journeys.",
    name: "Kenn Gallagher",
    title: "For Customers",
    img: stock_3,
  },
];

export const aboutUs_data = [
  {
    id: 1,
    content:
      "Gain access to insights and strategies curated by SEBI-registered analysts, ensuring informed decisions in your trading journey.",
    title: "Expert Guidance",
    img: aboutFeature,
  },
  {
    id: 2,
    content:
      "Join a vibrant community of experts and analysts, where you can interact, exchange ideas and stay updated on market trends. Engage in discussions, attend webinars and network with like-minded individuals.",
    title: "Active Community",
    img: aboutFeature2,
  },
  {
    id: 3,
    content:
      "Navigate the complexities of the stock market with ease using our intuitive tools and resources. From advanced analytics to real-time market data and educational materials, our platform provides everything you need.",
    title: "User-Friendly Tools",
    img: aboutFeature3,
  },
];

export const courseExpertise_data = [
  {
    id: "1",
    cardImg: courseImg,
    title: "Insights at your fingertips 1",
    image: courseUser,
    userName: "Rohit Aggi",
    ratingIcon: stars,
    rating: "4.4",
    telegramImg: telegram,
    experience: "Experience",
    totalExp: "7+",
    followers: "Followers",
    totalFollowers: "3.1k",
    callTime: "Duration : 3 hrs",
    callSession: "Session : 3",
    price: "₹1,999",
    btn: "Buy Now",
  },
  {
    id: "2",
    cardImg: courseImg,
    title: "Insights at your fingertips 2",
    image: courseUser,
    userName: "Rohit Aggi",
    ratingIcon: stars,
    rating: "4.4",
    telegramImg: telegram,
    experience: "Experience",
    totalExp: "7+",
    followers: "Followers",
    totalFollowers: "3.1k",
    callTime: "Duration : 3 hrs",
    callSession: "Session : 3",
    price: "₹1,999",
    btn: "Buy Now",
  },
  {
    id: "3",
    cardImg: courseImg,
    title: "Insights at your fingertips 3",
    image: courseUser,
    userName: "Rohit Aggi",
    ratingIcon: stars,
    rating: "4.4",
    telegramImg: telegram,
    experience: "Experience",
    totalExp: "7+",
    followers: "Followers",
    totalFollowers: "3.1k",
    callTime: "Duration : 3 hrs",
    callSession: "Session : 3",
    price: "₹1,999",
    btn: "Buy Now",
  },
  {
    id: "4",
    cardImg: courseImg2,
    title: "Insights at your fingertips 4",
    image: courseUser,
    userName: "Rohit Aggi",
    ratingIcon: stars,
    rating: "4.4",
    telegramImg: telegram,
    experience: "Experience",
    totalExp: "7+",
    followers: "Followers",
    totalFollowers: "3.1k",
    callTime: "Duration : 3 hrs",
    callSession: "Session : 3",
    price: "₹1,999",
    btn: "Buy Now",
  },
  {
    id: "5",
    cardImg: courseImg3,
    title: "Insights at your fingertips 5",
    image: courseUser,
    userName: "Rohit Aggi",
    ratingIcon: stars,
    rating: "4.4",
    telegramImg: telegram,
    experience: "Experience",
    totalExp: "7+",
    followers: "Followers",
    totalFollowers: "3.1k",
    callTime: "Duration : 3 hrs",
    callSession: "Session : 3",
    price: "₹1,999",
    btn: "Buy Now",
  },
];

export const expertsData = [
  {
    id: 1,
    icon: userBck,
    image: userImg,
    name: "Arun Kumer",
    role: "Commodity",
    rating: 4.5,
    experience: "10+",
    followers: 5289,
    description:
      "8979879234",
    prize: "5000",
  },

  {
    id: 2,
    icon: userBck,
    image: userImg,
    name: "Arun Kumer",
    role: "Option",
    rating: 4.5,
    experience: "10+",
    followers: 5289,
    description:
      "8979879234",
    prize: "5000",
  },

  {
    id: 3,
    icon: userBck,
    image: userImg,
    name: "Arun Kumer",
    role: "Equity",
    rating: 4.5,
    experience: "10+",
    followers: 5289,
    description:
      "8979879234",
    prize: "5000",
  },

  {
    id: 4,
    icon: userBck,
    image: userImg,
    name: "Arun Kumer",
    role: "Commodity",
    rating: 4.5,
    experience: "10+",
    followers: 5289,
    description:
      "8979879234",
    prize: "5000",
  },

  {
    id: 5,
    icon: userBck,
    image: userImg,
    name: "Arun Kumer",
    role: "Equity",
    rating: 4.5,
    experience: "10+",
    followers: 5289,
    description:
      "8979879234",
    prize: "5000",
  },

  {
    id: 6,
    icon: userBck,
    image: userImg,
    name: "Arun Kumer",
    role: "Option",
    rating: 4.5,
    experience: "10+",
    followers: 5289,
    description:
      "8979879234",
    prize: "5000",
  },
];

export const continueCoursesData = [
  {
    imageUrl: courseImg,
    title: "Continue Course 1",
    image: userImg,
    instructor: "Instructor 1",
    followers: 1500,
    experience: "2",
    duration: "2",
    session: "10",
    completedSession: "5",
  },
  {
    imageUrl: courseImg,
    title: "Continue Course 2",
    image: userImg,
    instructor: "Instructor 2",
    followers: 2000,
    experience: "3",
    duration: "3",
    session: "12",
    completedSession: "7",
  },
  {
    imageUrl: courseImg,
    title: "Continue Course 3",
    image: userImg,
    instructor: "Instructor 3",
    followers: 1800,
    experience: "2.5",
    duration: "2.5",
    session: "8",
    completedSession: "4",
  },
];

export const completedCoursesData = [
  {
    title: "Completed Course 1",
    imageUrl: courseImg,
    image: userImg,
    instructor: "Instructor 1",
    experience: "2 yrs",
    followers: "1000+",
    duration: "4 weeks",
    session: "20",
    completedSession: "20",
  },
  {
    title: "Completed Course 2",
    imageUrl: courseImg,
    image: userImg,
    instructor: "Instructor 2",
    experience: "3 yrs",
    followers: "1500+",
    duration: "6 weeks",
    session: "30",
    completedSession: "30",
  },
  {
    title: "Completed Course 2",
    imageUrl: courseImg,
    image: userImg,
    instructor: "Instructor 2",
    experience: "3 yrs",
    followers: "1500+",
    duration: "6 weeks",
    session: "30",
    completedSession: "30",
  },
];

export const recommendCoursesData = [
  {
    imageUrl: courseImg,
    rating: "4.4",
    title: "Continue Course 1",
    image: userImg,
    instructor: "Instructor 1",
    followers: 1500,
    experience: "2",
    duration: "2",
    session: "10",
    completedSession: "5",
  },
  {
    imageUrl: courseImg,
    title: "Continue Course 2",
    rating: "4.4",
    image: userImg,
    instructor: "Instructor 2",
    followers: 2000,
    experience: "3",
    duration: "3",
    session: "12",
    completedSession: "7",
  },
  {
    imageUrl: courseImg,
    title: "Continue Course 3",
    rating: "4.4",
    image: userImg,
    instructor: "Instructor 3",
    followers: 1800,
    experience: "2.5",
    duration: "2.5",
    session: "8",
    completedSession: "4",
  },
  {
    imageUrl: courseImg,
    title: "Continue Course 3",
    rating: "4.4",
    image: userImg,
    instructor: "Instructor 3",
    followers: 1800,
    experience: "2.5",
    duration: "2.5",
    session: "8",
    completedSession: "4",
  },
  {
    imageUrl: courseImg,
    title: "Continue Course 3",
    rating: "4.4",
    image: userImg,
    instructor: "Instructor 3",
    followers: 1800,
    experience: "2.5",
    duration: "2.5",
    session: "8",
    completedSession: "4",
  },
  {
    imageUrl: courseImg,
    title: "Continue Course 3",
    image: userImg,
    instructor: "Instructor 3",
    followers: 1800,
    experience: "2.5",
    duration: "2.5",
    session: "8",
    completedSession: "4",
  },
];

export const liveCourseData = [
  {
    imageUrl: courseImg,
    rating: "4.4",
    title: "Continue Course 1",
    image: userImg,
    instructor: "Instructor 1",
    followers: 1800,
    experience: "2.5",
    duration: "2.5",
    date: "Friday - 10 July | 10:00AM",
  },
  {
    imageUrl: courseImg,
    title: "Continue Course 2",
    rating: "4.4",
    image: userImg,
    instructor: "Instructor 2",
    followers: 1800,
    experience: "2.5",
    duration: "2.5",
    date: "Friday - 10 July | 10:00AM",
  },
  {
    imageUrl: courseImg,
    title: "Continue Course 3",
    rating: "4.4",
    image: userImg,
    instructor: "Instructor 3",
    followers: 1800,
    experience: "2.5",
    duration: "2.5",
    date: "Friday - 10 July | 10:00AM",
  },
  {
    imageUrl: courseImg,
    title: "Continue Course 3",
    rating: "4.4",
    image: userImg,
    instructor: "Instructor 3",
    followers: 1800,
    experience: "2.5",
    duration: "2.5",
    date: "Friday - 10 July | 10:00AM",
  },
  {
    imageUrl: courseImg,
    title: "Continue Course 3",
    rating: "4.4",
    image: userImg,
    instructor: "Instructor 3",
    followers: 1800,
    experience: "2.5",
    duration: "2.5",
    date: "Friday - 10 July | 10:00AM",
  },
  {
    imageUrl: courseImg,
    title: "Continue Course 3",
    rating: "4.4",
    image: userImg,
    instructor: "Instructor 3",
    followers: 1800,
    experience: "2.5",
    duration: "2.5",
    date: "Friday - 10 July | 10:00AM",
  },
];

export const expertData = [
  {
    name: "Arun Kumar",
    role: "Futures & Options",
    experience: "7years",
    followers: "31.5k",
    description:
      "Take your team up a level with easy-to-use tools, effortless templates and efficient workflows.",
    rating: 4.4,
    image: userImg,
  },
];

export const sessionsData = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  title: `Session ${index + 1} Title`,
  description: "Get full control of your business finances.",
  duration: "20min",
}));

export const singleCourse = {
  imageUrl: courseImg,
  title: "Course Title",
  level: "Medium",
  duration: "7 hr 20m",
  sessions: 5,
  completedSessions: 3,
  amount: "₹ 1,999/-",
  buyDate: "28/01/2024",
  access: "Lifetime Access",
  sessionsDetails: sessionsData,
  aboutCourse:
    "Lorem ipsum dolor sit amet consectetur. Nibh lectus aliquam sagittis nisl faucibus. Sed adipiscing condimentum volutpat cursus in risus sed sit. Ipsum aliquam urna porttitor eu. Volutpat ac sit at semper tortor vulputate. Purus pulvinar vestibulum cras odio. Congue amet sagittis dui pellentesque consectetur pellentesque et fermentum. Arcu elementum tempor nulla quis aenean fusce ut vulputate. A quam vitae magna pellentesque. Ut volutpat adipiscing purus faucibus duis orci. Accumsan venenatis eu vitae interdum dolor. Nunc at nibh habitant condimentum vitae. Semper luctus vulputate lacinia sit diam tellus id vitae. Morbi aliquet bibendum scelerisque vestibulum aliquet venenatis eu et. Proin bibendum eget lectus consequat id vitae. Eu hendrerit lobortis turpis quam ornare egestas tincidunt donec nulla. Justo nisi ac diam mauris cursus turpis lacus. Vulputate cras sem nec id eget. Cras lectus vestibulum dictum enim. Mauris ultrices etiam ac facilisis malesuada. Odio accumsan fringilla malesuada faucibus fusce pellentesque. Non nunc cursus nisl odio. Pellentesque laoreet molestie proin tincidunt cursus. Integer non odio turpis ac sem aliquam in ante congue. Erat pharetra sed semper duis duis penatibus. Ut congue interdum cras convallis eu nibh quis. Arcu at accumsan neque ultricies tellus massa leo nulla sed.",
};

export const walletData = [
  {
    transcationId: "#12324654685",
    date: "26/01/2024",
    subscription: "Expertise Basic",
    name: "Rohit",
    amount: "₹1,999 ",
    invoice: invoiceImg,
  },
  {
    transcationId: "#12324654685",
    date: "26/01/2024",
    subscription: "Expertise Basic",
    name: "Varun",
    amount: "₹1,999 ",
    invoice: invoiceImg,
  },
  {
    transcationId: "#12324654685",
    date: "26/01/2024",
    subscription: "Expertise Basic",
    name: "Amit",
    amount: "₹1,999 ",
    invoice: invoiceImg,
  },
  {
    transcationId: "#12324654685",
    date: "26/01/2024",
    subscription: "Expertise Basic",
    name: "Shivam",
    amount: "₹1,999 ",
    invoice: invoiceImg,
  },
  {
    transcationId: "#12324654685",
    date: "26/01/2024",
    subscription: "Expertise Basic",
    name: "Vinit",
    amount: "₹1,999 ",
    invoice: invoiceImg,
  },
  {
    transcationId: "#12324654685",
    date: "26/01/2024",
    subscription: "Expertise Basic",
    name: "Priyank",
    amount: "₹1,999 ",
    invoice: invoiceImg,
  },
  {
    transcationId: "#12324654685",
    date: "26/01/2024",
    subscription: "Expertise Basic",
    name: "Nikhil",
    amount: "₹1,999 ",
    invoice: invoiceImg,
  },
  {
    transcationId: "#12324654685",
    date: "26/01/2024",
    subscription: "Expertise Basic",
    name: "Rohit",
    amount: "₹1,999 ",
    invoice: invoiceImg,
  },
  {
    transcationId: "#12324654685",
    date: "26/01/2024",
    subscription: "Expertise Basic",
    name: "Mohan",
    amount: "₹1,999 ",
    invoice: invoiceImg,
  },
];

export const mission_vision = [
  {
    id: 1,
    image: vision,
    title: 'Mission',
    des: 'Our mission at Copartner is to empower traders and analysts by providing a trusted platform where they can connect, collaborate and thrive in the world of stock market trading. Through our user-friendly platform and valuable resources, we aim to foster a community-driven environment that promotes transparency, education and success for all participants. Join us as we will revolutionise the way traders and analysts interact, making the stock market accessible and profitable for everyone.'
  }, 
  {
    id: 2,
    image: vision2,
    title: 'Vision',
    des: 'At Copartner, our vision is to become the go-to platform for traders and analysts, revolutionising stock market trading and investing. We aspire to create a vibrant community where knowledge is shared freely, empowering individuals to make informed decisions and achieve financial success. With our user-centric approach and innovative solutions, we aim to simplify access to market insights,encouraging a culture of collaboration and growth for all. '
  }
]

export const faq_data = [
  {
    id: 1,
    title: 'What type of research do you provide?',
    des: 'We provide comprehensive research reports, market analysis and trading strategies across various sectors and assets to help traders make informed investment and trading decisions.'
  },
  {
    id: 2,
    title: 'How can I access your research reports and analysis?',
    des: "Our research reports and analysis are available to subscribers through our online platform. Once you subscribe to our services, you'll gain access to our library of research content, which you can view and download at your convenience."
  },
  {
    id: 3,
    title: 'Do you offer educational resources for beginner traders?',
    des: "Yes, we offer educational resources, such as webinars, tutorials, and articles, designed to help beginner traders understand the fundamentals of investing and trading. These resources cover topics like technical analysis, fundamental analysis, risk management and many more topics."
  },
  {
    id: 4,
    title: 'How often do you update your research?',
    des: "We update our research regularly to reflect the latest market trends and developments. Typically, we publish new research reports and analysis on a weekly basis, ensuring our clients have access to up-to-date information."
  },
  {
    id: 5,
    title: 'What type of research do you provide?',
    des: 'We provide comprehensive research reports, market analysis and trading strategies across various sectors and assets to help traders make informed investment and trading decisions.'
  },
  {
    id: 6,
    title: 'How can I access your research reports and analysis?',
    des: "Our research reports and analysis are available to subscribers through our online platform. Once you subscribe to our services, you'll gain access to our library of research content, which you can view and download at your convenience."
  },
]

export const faq_data2 = [
  {
    id: 1,
    title: 'How do I access the premium group subscription after making the payment?',
    des: 'After completing the payment process, you will receive a confirmation sms containing a unique link to join the premium group. You can also access the premium group directly from the Copartner platform after payment.'
  },
  {
    id: 2,
    title: 'What benefits do I get with the premium group subscription?',
    des: "With the premium group subscription, you will gain exclusive access to advanced trading tips, in-depth market analysis, and real-time insights provided by the Research Analyst."
  },
  {
    id: 3,
    title: 'Is the payment for the premium group subscription a one-time fee or recurring?',
    des: "The payment for the premium group subscription is a one-time fee, granting you access to the premium group for a specified duration."
  },
  {
    id: 4,
    title: 'What if I encounter any issues or have questions regarding the premium group subscription?',
    des: "If you encounter any issues or have questions regarding your premium group subscription, please don't hesitate to contact our customer support team for assistance. You can reach out to us via support@copartner.in"
  },
  {
    id: 5,
    title: 'Where i can see when my subscription will expire?',
    des: 'Go to subscription > check subscription duration of purchased service'
  },
]

export const blogs = [
  {
    id: 10001,
    imageUrl: Blog1,
    title: "Building Trust: How SEBI Analysts Can Connect with Traders",
    heading1: "How SEBI Analysts Can Connect with Traders",
    content1: `In this fast-paced world of stock trading, earning the trust of traders as a SEBI registered research analyst is essential. These analysts are pivotal in helping traders navigate the complexities of the market but establishing credibility requires more than just expertise. It demands a genuine connection with traders. One fundamental aspect is transparency. Analysts must be open about their research methods and the reasons behind their recommendations. By providing clear explanations and disclosing potential risks, analysts can build confidence in traders and establish themselves as reliable guides. `,
    content2: `Consistent communication is another crucial factor. Analysts should maintain regular contact with traders through newsletters, market updates and interactive sessions. This ongoing dialogue not only keeps traders informed but also demonstrates the analyst's commitment to their clients' success. Tailoring recommendations to suit the individual needs and preferences of traders is equally important. By understanding each trader's goals and risk tolerance, analysts can offer personalised advice that resonates with their audience. Analysts must prioritise honesty and fairness in all their interactions, ensuring that traders feel secure and valued. By following these principles, our SEBI registered research analysts can solidify their reputation as trusted advisors in the world of trading and investing. Our platform serves as a bridge between SEBI-registered analysts and traders, facilitating seamless interaction and collaboration. Traders here can access this valuable information, engage with analysts and seek personalised guidance for their trading decisions. Through features like messaging, forums and one-on-one consultations, analysts and traders can connect, communicate and collaborate effectively, fostering a supportive and enriching environment for all participants. Whether it's seeking expert advice, sharing market updates, or discussing investment opportunities, our platform enables meaningful interactions that empower traders to make informed decisions and succeed in the stock market. `,
    heading2: "Transparency Builds Confidence",
    content3: `From the trader's viewpoint, the stock market can be a complex  landscape to navigate. With so many variables at play, they rely on analysts to provide them with insights that can help them make informed decisions. For analysts, this means not just providing recommendations, but also explaining the rationale behind them. Transparency is key here. Traders want to know why analysts are making certain recommendations and what risks are involved. By being transparent in their communication, analysts can build trust with traders and establish themselves as reliable sources of information. But trust isn't just about what analysts say; it's also about how they engage with traders. Traders want to feel like they're being heard and that their concerns are being addressed. This means being responsive to trader inquiries and providing support when needed. It also means engaging with traders on a personal level, whether through one-on-one consultations or community forums. By being accessible and approachable, analysts can build trust with traders and foster long-lasting relationships. Ultimately, trust is about more than just providing accurate recommendations. It's about understanding the trader's perspective, being transparent in communication, and offering valuable support. By embracing these principles, SEBI analysts can build trust with traders and establish themselves as reliable sources of information and guidance in the stock market. And in doing so, they can pave the way for successful partnerships that benefit both parties`,
    bio: "Empowering traders with our personalized engagement, our SEBI platform bridges the gap between analysts and traders."
  },
  {
    id: 10002,
    imageUrl: Blog2,
    title: "How traders can benefit their trading edge with Copartner platform",
    heading1: "How traders can benefit their trading edge with Copartner platform",
    content1: `In the world of trading, knowledge is power and making informed decisions can make all the difference between success and 
    failure. That's where our portal steps in. At Copartner, we understand the challenges traders face, which is why we've created a 
    platform to connect you with SEBI registered research analysts who can provide valuable insights and tips to help you become a more 
    profitable trader. Whether you're just starting out or you've been trading for years, our goal is to empower you with the knowledge and 
    expertise you need to thrive in the market. Through our portal, you'll have access to a diverse range of analysts who specialise in 
    different markets and trading strategies. From understanding market trends to identifying high-potential opportunities, our analysts are 
    here to guide you every step of the way. But it's not just about giving you tips and advice, it's about arming you with the tools and 
    knowledge to make your own informed decisions. `,
    content2: `That's why we provide a wealth of resources, including articles, webinars and courses, designed to help you develop your 
    trading skills and strategies. So if you're ready to take your trading game to the next level and increase your chances of success in 
    the market, look no further than our portal. Join us today and let's embark on this journey together towards becoming a more profitable
     trader!Copartner offers access to SEBI registered research analysts who provide expert analysis and insights into the stock market. 
     These analysts bring years of experience and expertise to the table, helping traders make more informed decisions and navigate the 
     complexities of the market with confidence. By leveraging the insights provided by these analysts, traders can gain a deeper understanding 
     of market trends, identify profitable opportunities, and mitigate risks In addition to expert analysis, Copartner also fosters a 
     collaborative community where traders can interact with one another, share ideas, and learn from each other's experiences. Through forums, webinars, and social media platforms, traders can engage with fellow members of the Copartner community, exchange trading strategies, and stay up-to-date on the latest market developments.`,
    heading2: "How Our Platform Works",
    content3: `This sense of community not only provides traders with valuable insights and perspectives but also helps them feel supported and connected in their trading journey. Moreover, Copartner offers a range of educational resources and tools designed to help traders enhance their trading skills and knowledge. From tutorials and webinars to market insights and trading guides, our platform equips traders with the information and resources they need to succeed in the market. Whether you're a seasoned trader looking to refine your strategies or a novice investor just starting out, Copartner provides the resources and support you need to improve your trading performance and achieve your financial goals. Ultimately, Copartner is more than just a trading platform; it's a community of traders and analysts working together to enhance their trading edge and achieve success in the stock market. By leveraging expert analysis, collaborating with fellow traders, and accessing valuable educational resources, traders can gain the knowledge, insights, and support they need to take their trading to new heights with Copartner.`,
    bio: "Join us at Copartner and transform your trading game with expert insights and a supportive community."
  },
  {
    id: 10003,
    imageUrl: Blog3,
    title: "Empowering Analysts: Seamless Access to a Diverse Trader Network",
    heading1: "Maximizing Analyst Outreach",
    content1: `In the world of finance, SEBI registered research analysts are like expert guides for traders, helping them make smart decisions in the market. But sometimes, reaching out to new traders can be tricky for these analysts. That's where our portal comes in to help. By joining our portal, these analysts can connect with lots of different traders from beginners to experienced ones. It's like having a big marketplace where traders can find trustworthy analysts all in one place. This makes it easier for analysts to find new clients and show off their skills. On our portal, analysts can talk directly to traders through things like forums and webinars. This helps them build trust and show traders that they know their stuff. Plus, analysts can offer different services to fit what each trader needs, whether it's personalised advice or special reports. So, our portal is like a bridge that connects SEBI registered research analysts with traders. It helps analysts find new clients, talk to them easily and offer the services that suit their needs. `,
    content2: `It helps analysts find new clients, talk to them easily and offer the services that suit their needs. The platform's user-friendly interface makes it easy for you to publish your research reports, market analysis, and trading strategies. With just a few clicks, you can share your insights with a large pool of traders who are looking for reliable advice. This ease of sharing helps you establish yourself as a thought leader and trusted advisor in the industry. In addition, Copartner promotes your work to its community of traders, giving you increased visibility and exposure. As traders explore the platform, they can easily find your research reports and insights, leading to more opportunities for you to showcase your expertise and attract a loyal following. The platform's focus on collaboration and knowledge sharing further amplifies your reach. By engaging with other analysts and traders on Copartner, you can participate in discussions, share ideas, and gain exposure to new perspectives. This collaborative environment fosters a sense of community and encourages traders to seek out your insights. Copartner also provides you with data and analytics to track the performance of your reports and interactions with traders.`,
    heading2: "How Our Platform Works",
    heading2: " Leveraging Copartner's Collaborative Environment",
    content3: `This feedback helps you understand which areas resonate most with your audience and allows you to tailor your future content to better meet their needs. Finally, Copartner's emphasis on SEBI registration ensures that traders can trust the advice they receive on the platform. This credibility boosts your reputation and attracts traders who are serious about making informed decisions and achieving success in the stock market. In conclusion, Copartner is a valuable platform for SEBI-registered research analysts looking to expand their reach and connect with a wider audience. By leveraging the platform's tools and features, you can share your expertise with traders, engage directly with your audience, and grow your professional network. Join Copartner today and start your journey towards reaching a broader range of traders and making a lasting impact in the stock market industry`,
    bio: "Empowering SEBI-registered analysts to connect with traders amplifying expertise on our collaborative platform."
  },
  {
    id: 10004,
    imageUrl: Blog4,
    title: "Protect Your Wealth: Investing Safely with Copartner",
    heading1: "Why Protecting Your Money Matters",
    content1: `Investing in the stock market can be a rewarding journey,
    offering the potential for significant returns and financial growth. However,
    it also comes with risks that require careful consideration and strategic
    planning. Protecting your money in the stock market is essential for achieving
    long-term financial success and security. That's where Copartner comes in –
    your trusted partner for investing smartly and safely in the stock market.`,
    content2: `Investing in the stock market can be both rewarding and challenging, offering significant returns along with inherent risks. However, with careful consideration and strategic planning, it's possible to navigate these risks and achieve long-term financial success. Copartner serves as your trusted partner in this journey, providing smart and safe investment solutions tailored to your needs. Protecting your money is paramount, mitigating risks, preserving capital, and aligning investments with your financial goals. Whether it's weathering market volatility, growing your wealth, or planning for the future, Copartner is here to support you every step of the way.`,
    heading2: "How Copartner Helps You Invest Smartly",
    content3: `Copartner is committed to empowering traders and investors with the necessary tools, resources, and expertise to make smart investment decisions in the stock market while safeguarding their money. Our platform provides access to SEBI-registered research analysts who offer expert insights and market analysis, enabling users to navigate market trends with confidence. Additionally, we offer real-time market data, news, and insights to keep investors informed and protect their portfolios from market volatility. Our platform also offers guidance on effective risk management strategies, personalized investment advice tailored to individual financial goals, and a wealth of educational resources to enhance investors' knowledge of the stock market. Furthermore, our vibrant community of traders and investors fosters collaboration and support, enabling users to share experiences, insights, and strategies. Join Copartner today to embark on a journey towards smart, safe, and successful investing in the stock market, guided by a trusted partner dedicated to your financial well-being.`,
    bio: "Empowering investors to invest smartly with Copartner's trusted expertise."
  },
  {
    id: 10005,
    imageUrl: Blog5,
    title: "Diversify Your Portfolio with SEBI-Registered Analysts",
    heading1: "Expert Guidance for Diversified Portfolios",
    content1: `Diversification is a cornerstone of successful investing, offering a strategy to manage risk and optimize returns. Copartner understands the importance of diversification and facilitates access to SEBI-registered research analysts who provide expert insights and personalized advice. By diversifying across different assets, sectors, and markets, investors can shield their portfolios from market fluctuations and potential losses.`,
    content2: `Copartner's platform connects investors with analysts specializing in various sectors, including technology, healthcare, and finance. These analysts offer tailored investment strategies based on individual financial goals, risk tolerance, and investment horizons. With recommendations spanning equities, fixed income, and commodities, investors can build well-balanced portfolios that weather market volatility and capitalize on diverse opportunities.`,
    heading2: "Maximize Returns Through Copartner",
    content3: `Join Copartner today to streamline the diversification process and access expert insights into global markets. Our SEBI-registered analysts provide ongoing monitoring and adjustments, ensuring portfolios remain well-diversified and aligned with investors' evolving needs. With Copartner, investors can navigate the complexities of diversification with confidence, achieving long-term financial success and wealth protection.`,
    bio: " Investors to build resilient portfolios through expert diversification strategies."
  },
  {
    id: 10006,
    imageUrl: Blog5,
    title: "Staying Safe: Tips for Avoiding Fraudulent Investment Advice on Telegram",
    heading1: "Introduction to Our Platform",
    content1: `With the rise of digital communication platforms, traders have more access than ever to information and advice from various sources. While this can be beneficial, it also increases the risk of encountering fraudulent investment advice, especially on messaging apps like Telegram. Staying safe from these scams is crucial for protecting your investments and financial well-being. Here's how you can avoid fraudulent investment advice on Telegram, with insights from Copartner. First, be cautious of unsolicited messages or tips from unknown sources. Scammers often target traders by sending messages with promises of high returns or insider knowledge. If you receive an unexpected message, take a step back and verify the source before considering any advice. Look for SEBI registration when dealing with analysts.`,
    content2: `Legitimate research analysts in India are registered with the Securities and Exchange Board of India (SEBI). Copartner exclusively connects traders with SEBI-registered analysts, ensuring that you receive advice from credible and experienced professionals. By relying on registered experts, you can avoid unverified and potentially harmful tips. Always conduct your own research before acting on any investment advice. Fraudulent 
    advisors may use persuasive language and exaggerated claims to lure you in. Cross-check any information with reputable sources, analyse market trends, and consult reliable analysts. Copartner's platform offers access to expert analysis and insights that can help you make informed decisions. Stay wary of investment opportunities that seem too good to be true. Scammers often promise guaranteed profits or unusually high returns with 
    little to no risk. Remember that all investments carry some level of risk, and there is no such thing as a guaranteed return. Be sceptical of anyone offering unrealistic promises. Monitor the reputation and credibility of the channels and groups you follow on Telegram. `,
    heading2: "Tips for Protecting Your Investments on Telegram",
    content3: `Look for groups with active discussions, transparent moderators, and positive reviews. Copartner's community-driven platform provides a space for traders to share knowledge and discuss strategies, offering a safer and more reliable environment for collaboration. Finally, trust your instincts. If something feels off or too good to be true, it probably is. Don't be afraid to ignore or report suspicious messages or groups on Telegram. Protecting your financial well-being should be your top priority. In conclusion, staying safe from fraudulent investment advice on Telegram requires vigilance and discernment. By relying on SEBI-registered analysts, conducting your own research, and using a trusted platform like Copartner, you can make informed decisions and avoid falling victim to scams. Prioritise your financial security and trade confidently with credible sources and expert guidance.`,
    bio: "Traders to navigate digital investments safely with Copartner insights."
  },
  {
    id: 10007,
    imageUrl: Blog3,
    title: "Spot Good Advice: Simple Ways to Evaluate Financial Tips",
    heading1: "Evaluating Financial Advice",
    content1: `Navigating the world of financial advice can be tricky, especially when there are so many sources offering tips and recommendations. As a trader or investor, it's important to be able to spot good advice and differentiate it from misleading or unreliable information. In the context of Copartner, where traders can connect with SEBI-registered analysts, here are some simple ways to evaluate financial tips and make informed decisions: First, consider the source of the advice. Trustworthy tips come from credible experts with a proven track record of success. Copartner exclusively connects traders with SEBI-registered research analysts, ensuring that you receive advice from professionals who are regulated and experienced in the stock market. Next, look for transparency in the advice provided. A good analyst will explain their rationale and the factors they considered when making a recommendation. Copartner's analysts offer in-depth market analysis and clear explanations, helping you understand the reasoning behind their advice. Another important factor to consider is consistency. Reliable analysts provide tips that align with broader market trends and established investment strategies.`,
    content2: `Copartner's platform allows you to access a variety of analysts' insights, enabling you to cross-check advice and see if there is a consensus among experts. Pay attention to the risk level associated with the advice. Good financial tips should include an assessment of the risks involved in a particular investment. Copartner's analysts provide comprehensive information about potential risks and rewards, allowing you to make informed decisions that align with your risk tolerance. It's also wise to verify any claims made in the advice. Cross-checking the information with reputable sources, such as financial news outlets or other analysts, can help you confirm the accuracy of the advice. Copartner's community-driven platform provides access to a network of traders and analysts who can offer additional perspectives and insights. When evaluating financial tips, consider the impact of market timing. A good tip should take current market conditions into account and provide guidance on when to act. Copartner's analysts offer real-time market insights, helping you make timely decisions based on the latest trends. `,
    heading2: "Navigating Copartner's Platform for Informed Decisions",
    content3: `Lastly, trust your instincts. If something feels off or too good to be true, take a step back and reassess the advice. Good financial tips should resonate with your own research and understanding of the market. In conclusion, spotting good financial advice is key to making informed investment decisions and protecting your money. By following these simple evaluation methods and relying on Copartner's platform to connect with SEBI-registered analysts, you can access trustworthy advice and navigate the stock market with confidence. Prioritise your financial well-being by staying vigilant and seeking out expert guidance that aligns with your goals and values.`,
    bio: "Start your financial journey with SEBI-registered analysts, ensuring credible insights & informed Decision"
  },
  {
    id: 10008,
    imageUrl: Blog1,
    title: "If Scammed by a Stock Tipping Channel: Know Your Rights & Actions",
    heading1: "Protecting Yourself from Stock Tipping Scams",
    content1: `With the rise of digital platforms and messaging apps, stock market traders have access to a vast array of information and advice from different sources. While this can be beneficial, it also opens the door to scams, especially from unverified stock tipping channels. If you find yourself a victim of a scam from a stock tipping channel, it's essential to know your rights and take steps to protect yourself. Here's what you can do if you've been scammed, with advice from Copartner. First, recognize the signs of a scam. If you receive unsolicited tips promising guaranteed returns, high-pressure sales tactics or insider knowledge, be cautious, scammers often use these tactics to lure traders into risky investments.`,
    content2: `If you've already been scammed, the first step is to stop all further transactions with the channel. Do not engage with them further or accept any new tips. Your safety is paramount, so take a break and assess the situation. Next, gather all evidence related to the scam. Keep records of any messages, transactions or communications with the channel. This information will be crucial if you need to report the scam or seek legal assistance. Once you have your evidence, report the scam to the relevant authorities. In India, you can file a complaint with the Securities and Exchange Board of India (SEBI) or the local police. Reporting the scam can help prevent others from falling victim to the same fraudulent channel. You should also consider seeking legal advice. A lawyer can guide you through the process of recovering your losses and help you understand your rights as a trader. To prevent future scams, be cautious about where you seek financial advice.`,
    heading2: "Copartner's Guide to Recovery and Prevention",
    content3: `Rely on reputable sources like Copartner, which connects traders with SEBI-registered research analysts. These experts provide reliable and trustworthy advice that you can act on with confidence. In addition to using reputable sources, stay vigilant about who you trust with your investments. Conduct your own research, verify the credibility of the channel or analyst, and cross-check any information you receive with trusted sources. If you believe you've been scammed, Copartner's community-driven platform can provide support. Connect with other traders, share your experience, and learn from others' experiences. By engaging with the community, you can gain insights into how to avoid scams and make informed decisions. In conclusion, being scammed by a stock tipping channel can be a distressing experience, but knowing your rights and taking proactive steps can help you recover and protect yourself in the future. By reporting the scam, seeking legal advice, and using reputable sources like Copartner, you can navigate the stock market safely and confidently. Stay vigilant and prioritise your financial well-being by relying on trusted experts and conducting your own research.`,
    bio: "Safeguard your investments with Copartner's trusted advice and community support, empowering you to navigate the stock market safely and confidently."
  },

];
