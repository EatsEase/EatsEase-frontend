interface CardItem {
    id: string;
    menuTitle: string;
    backgroundColor: string;
    image?: any;
  }

type RootStackParamList = {
    HomeScreen: undefined;
    YourListScreen: { likedMenus: CardItem[]; dislikedMenus: CardItem[] };
    Signup: undefined;
    Login: undefined;
    FirstPreferences: undefined;
    AllergiesScreen: undefined;
    Preferences: undefined;
    MainLayout: undefined;
    Profile: undefined;
    History: undefined;
    MapScreen: { finalizedMenu: string };
    ErrorScreen: { error: string };
};