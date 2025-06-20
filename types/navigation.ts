import { NavigatorScreenParams, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  AuthWelcome: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  SelectDriver: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  RideHistory: undefined;
  RideHistoryDetails: { rideId: string };
  PaymentInfo: undefined;
};

export type MainStackParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
  Logout: undefined;
};

export type RootStackParamList = {
  AuthFlow: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

export type ProfileStackNavigationProp = NativeStackNavigationProp<ProfileStackParamList>;
export type ProfileStackRouteProp<RouteName extends keyof ProfileStackParamList> = RouteProp<ProfileStackParamList, RouteName>;
