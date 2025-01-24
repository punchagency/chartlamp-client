// ----------------------------------------------------------------------

export enum DESIGNATIONS {
    Optometrist = 'Optometrist',
    OpticalAssistant = 'Optical assistant',
    OpticalStylist = 'Optical stylist',
    Admin = 'Admin',
    LabTech = 'Lab tech',
    Manager = 'Manager'
  }
  
  export const DESIGNATION_OPTION = [
    { label: 'Optometrist', value: 'Optometrist' },
    { label: 'Optical assistant', value: 'Optical assistant' },
    { label: 'Optical stylist', value: 'Optical stylist' },
    { label: 'Admin', value: 'Admin' },
    { label: 'Lab tech', value: 'Lab tech' },
    { label: 'Manager', value: 'Manager' },
  ];
  
  export type IUserSocialLink = {
    facebookLink: string;
    instagramLink: string;
    linkedinLink: string;
    twitterLink: string;
  };
  
  export type IUserProfileFollowers = {
    follower: number;
    following: number;
  };
  
  export type IUserProfileCover = {
    name: string;
    cover: string;
    role: string;
  };
  
  export type IUserProfileAbout = {
    quote: string;
    country: string;
    email: string;
    role: string;
    company: string;
    school: string;
  };
  
  export type IUserProfile = IUserProfileFollowers &
    IUserProfileAbout & {
      id: string;
      socialLinks: IUserSocialLink;
    };
  
  export type IUserProfileFollower = {
    id: string;
    avatarUrl: string;
    name: string;
    country: string;
    isFollowed: boolean;
  };
  
  export type IUserProfileGallery = {
    id: string;
    title: string;
    postAt: Date | string | number;
    imageUrl: string;
  };
  
  export type IUserProfileFriend = {
    id: string;
    avatarUrl: string;
    name: string;
    role: string;
  };
  
  export type IUserProfilePost = {
    id: string;
    author: {
      id: string;
      avatarUrl: string;
      name: string;
    };
    isLiked: boolean;
    createdAt: Date | string | number;
    media: string;
    message: string;
    personLikes: {
      name: string;
      avatarUrl: string;
    }[];
    comments: {
      id: string;
      author: {
        id: string;
        avatarUrl: string;
        name: string;
      };
      createdAt: Date | string | number;
      message: string;
    }[];
  };
  
  // ----------------------------------------------------------------------
  
  export type IUserCard = {
    id: string;
    avatarUrl: string;
    cover: string;
    name: string;
    follower: number;
    following: number;
    totalPosts: number;
    role: string;
  };
  
  // ----------------------------------------------------------------------
  
  export type IUserAccountGeneral = {
    id: string;
    avatarUrl: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    country: string;
    state: string;
    city: string;
    zipCode: string;
    company: string;
    isVerified: boolean;
    status: string;
    role: string;
  };
  
  export type IUserAccountBillingCreditCard = {
    id: string;
    cardNumber: string;
    cardType: string;
  };
  
  export type IUserAccountBillingInvoice = {
    id: string;
    createdAt: Date | string | number;
    price: number;
  };
  
  export type IUserAccountBillingAddress = {
    id: string;
    name: string;
    phone: string;
    country: string;
    state: string;
    city: string;
    street: string;
    zipCode: string;
  };
  
  export type IUserAccountChangePassword = {
    old_password: string;
    new_password: string;
    confirm_new_password: string;
  };
  
  // ---------------------------------------------------------------------- ChartLamp user
  
  export type ChartLampEmployee = {
    id: number;
    practice_id: string;
    role: string;
    designation: string;
    firstname: string;
    surname: string;
    gender: string | null;
    date_of_birth: string | null;
    start_date: string;
    home_address: string | null;
    mobile: string;
    email: string;
    image_url: string | null;
    open_time: string;
    close_time: string;
    appointment_duration: string;
    working_days: string;
    status: number;
    can_login: number;
    created_by: number;
    updated_by: number | null;
    deleted_by: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }
  
  export type ChartLampUser = {
    _id: number;
    name: string;
    email: string;
    profilePicture?: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
    role: string;
    twoFactorAuth?: {
      isEnabled: boolean;
      method: string;
      phoneNumber?: string;
    };
  };
  
  // ----------------------------------------------------------------------
  
  export type IUserAccountNotificationSettings = {
    activityComments: boolean;
    activityAnswers: boolean;
    activityFollows: boolean;
    applicationNews: boolean;
    applicationProduct: boolean;
    applicationBlog: boolean;
  };
  
  // ----------------------------------------------------------------------
  export type ChartLampUserState = {
    isAuthenticated: boolean,
    isLoading: boolean;
    error: Error | string | null;
    user: ChartLampUser | null;
  };
  